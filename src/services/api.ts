import { API_CONFIG, isApiConfigured } from "../config/api";
import type { Message, ResponseStyle } from "../utils/types";
import type { UserProfile } from "../utils/profile";

export class ApiError extends Error {
  kind: "network" | "auth" | "rate_limit" | "timeout" | "invalid_response" | "not_configured" | "unknown";

  constructor(kind: ApiError["kind"], message: string) {
    super(message);
    this.kind = kind;
  }
}

/**
 * The Cloudflare Worker accepts the conversation plus the locally saved
 * user profile and response-style preference.
 * The Worker owns the Gemini API key and Rasmalai's system prompt.
 * No secret is sent from this browser app.
 */
function buildRequestBody(messages: Message[], responseStyle: ResponseStyle, profile: UserProfile) {
  return {
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    profile: {
      name: profile.name,
      nickname: profile.nickname,
      gender: profile.gender,
    },
    responseStyle,
  };
}

function buildHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "text/event-stream, application/json",
  };
}

/** Gemini's native streaming chunks contain text at:
 * candidates[0].content.parts[0].text
 */
function parseGeminiStreamChunk(json: any): string {
  const parts = json?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";

  return parts
    .map((part: any) => (typeof part?.text === "string" ? part.text : ""))
    .join("");
}

function parseErrorMessage(json: any): string | null {
  const message = json?.error?.message;
  return typeof message === "string" ? message : null;
}

/** Extract text from a non-streaming Gemini response if the Worker falls back to JSON. */
function parseNonStreamResponse(json: any): string {
  const text = json?.candidates?.[0]?.content?.parts
    ?.map((part: any) => (typeof part?.text === "string" ? part.text : ""))
    .join("");

  if (typeof text !== "string" || !text) {
    throw new ApiError("invalid_response", "Response did not contain expected text content.");
  }

  return text;
}

interface StreamCallbacks {
  onToken: (textSoFar: string) => void;
  signal?: AbortSignal;
}

/**
 * Sends the conversation to the Cloudflare Worker and streams Gemini text
 * progressively into the Rasmalai UI.
 */
export async function sendMessage(
  messages: Message[],
  responseStyle: ResponseStyle,
  profile: UserProfile,
  { onToken, signal }: StreamCallbacks
): Promise<string> {
  if (!isApiConfigured()) {
    throw new ApiError(
      "not_configured",
      "Rasmalai API is not configured yet."
    );
  }

  let response: Response;

  try {
    response = await fetch(API_CONFIG.url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(buildRequestBody(messages, responseStyle, profile)),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError("network", "Could not reach the Rasmalai API.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new ApiError("auth", "The API request was not authorized.");
  }

  if (response.status === 429) {
    throw new ApiError("rate_limit", "Rate limit reached. Try again shortly.");
  }

  if (!response.ok) {
    let serverMessage = "";
    try {
      const errorJson = await response.json();
      serverMessage = parseErrorMessage(errorJson) ?? "";
    } catch {
      // Ignore non-JSON error bodies.
    }

    throw new ApiError(
      "unknown",
      serverMessage || `API returned an error (status ${response.status}).`
    );
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  // Non-streaming fallback.
  if (!contentType.includes("text/event-stream") || !response.body) {
    const json = await response.json().catch(() => {
      throw new ApiError("invalid_response", "Response was not valid JSON.");
    });

    const text = parseNonStreamResponse(json);
    onToken(text);
    return text;
  }

  // Streaming path: parse SSE events without buffering the full response.
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by a blank line. Keeping the final
      // incomplete event in `buffer` avoids dropping JSON split across reads.
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? "";

      for (const event of events) {
        const dataLines = event
          .split(/\r?\n/)
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim());

        if (dataLines.length === 0) continue;

        const data = dataLines.join("\n");
        if (!data || data === "[DONE]") continue;

        try {
          const json = JSON.parse(data);
          const delta = parseGeminiStreamChunk(json);

          if (delta) {
            fullText += delta;
            onToken(fullText);
          }
        } catch {
          // Ignore malformed SSE events; the next event can still be parsed.
        }
      }
    }

    // Process a final event if the server closed without a trailing blank line.
    if (buffer.trim()) {
      const dataLines = buffer
        .split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());

      const data = dataLines.join("\n");
      if (data && data !== "[DONE]") {
        try {
          const json = JSON.parse(data);
          const delta = parseGeminiStreamChunk(json);
          if (delta) {
            fullText += delta;
            onToken(fullText);
          }
        } catch {
          // Ignore an incomplete final event.
        }
      }
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError("network", "Connection interrupted while streaming.");
  }

  if (!fullText) {
    throw new ApiError("invalid_response", "Received an empty response from Rasmalai.");
  }

  return fullText;
}
