import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import type { Message } from "../utils/types";
import { MessageBubble } from "./MessageBubble";
import { WelcomeScreen } from "./WelcomeScreen";
import type { UserProfile } from "../utils/profile";

interface Props {
  messages: Message[];
  isStreaming: boolean;
  isWaitingForFirstToken: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onSuggestionClick: (text: string) => void;
  profile: UserProfile;
}

export function ChatWindow({
  messages,
  isStreaming,
  isWaitingForFirstToken,
  errorMessage,
  onRetry,
  onSuggestionClick,
  profile,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isWaitingForFirstToken, errorMessage]);

  if (messages.length === 0 && !errorMessage) {
    return <WelcomeScreen onSuggestionClick={onSuggestionClick} profile={profile} />;
  }

  return (
    <div className="chat-window scroll-thin">
      <div className="chat-window-inner">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} isStreaming={isStreaming && m.role === "assistant" && m.id === messages[messages.length - 1]?.id} />
        ))}

        {isWaitingForFirstToken && (
          <MessageBubble
            message={{
              id: "rasmalai-thinking-placeholder",
              role: "assistant",
              content: "",
              timestamp: Date.now(),
            }}
            isStreaming
          />
        )}

        {errorMessage && (
          <div className="error-banner">
            <span>{errorMessage}</span>
            <button className="retry-btn" onClick={onRetry}>
              <RotateCcw size={13} />
              Retry
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <style>{`
        .chat-window {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px 8px;
        }

        .chat-window-inner {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .error-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: var(--accent-soft);
          border: 1px solid var(--accent);
          color: var(--accent-strong);
          padding: 11px 14px;
          border-radius: var(--radius-md);
          font-size: 13.5px;
          animation: msgIn 0.22s ease;
        }

        .retry-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: var(--accent);
          color: white;
          border: none;
          padding: 6px 11px;
          border-radius: var(--radius-pill);
          font-size: 12.5px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .retry-btn:hover {
          background: var(--accent-strong);
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
