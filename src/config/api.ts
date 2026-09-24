/**
 * Rasmalai API configuration.
 *
 * The Gemini API key is intentionally NOT stored in the frontend.
 * It lives as GEMINI_API_KEY inside the Cloudflare Worker.
 */

export const API_CONFIG = {
  url: import.meta.env.VITE_API_URL || "https://jyoti-ai-api.aditya543maurya.workers.dev/",
};

export function isApiConfigured(): boolean {
  return Boolean(API_CONFIG.url);
}
