import { JyotiAvatar } from "./JyotiAvatar";

export function TypingIndicator() {
  return (
    <div className="typing-row">
      <JyotiAvatar size={30} glow />
      <div className="typing-bubble">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>

      <style>{`
        .typing-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          padding: 2px 0;
          animation: msgIn 0.25s ease;
        }

        .typing-bubble {
          background: var(--ai-bubble);
          border: 1px solid var(--ai-bubble-border);
          border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) 6px;
          padding: 13px 16px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ink-faint);
          animation: typingBounce 1.1s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
