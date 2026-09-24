import { useEffect, useRef, useState } from "react";
import { ArrowUp, Plus } from "lucide-react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  enterToSend: boolean;
  prefillText?: string;
  onPrefillConsumed?: () => void;
}

export function ChatInput({ onSend, disabled, enterToSend, prefillText, onPrefillConsumed }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefillText) {
      setValue(prefillText);
      onPrefillConsumed?.();
      textareaRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillText]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [value]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && enterToSend) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-input-wrap">
      <div className="chat-input-bar">
        <button className="attach-btn" aria-label="Attach" disabled title="Attachments coming soon">
          <Plus size={19} />
        </button>

        <textarea
          ref={textareaRef}
          className="chat-textarea scroll-thin"
          placeholder="Type something..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
        >
          <ArrowUp size={18} />
        </button>
      </div>

      <style>{`
        .chat-input-wrap {
          padding: 8px 12px calc(10px + var(--safe-bottom));
          background: var(--bg-elevated);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid var(--border-soft);
        }

        .chat-input-bar {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          max-width: 720px;
          margin: 0 auto;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 6px 6px 6px 10px;
          box-shadow: var(--shadow-soft);
        }

        .attach-btn {
          background: transparent;
          border: none;
          color: var(--ink-faint);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          opacity: 0.5;
        }

        .chat-textarea {
          flex: 1;
          border: none;
          background: transparent;
          resize: none;
          outline: none;
          color: var(--ink);
          font-size: 15px;
          line-height: 1.4;
          padding: 7px 2px;
          max-height: 140px;
          font-family: var(--font-ui);
        }

        .chat-textarea::placeholder {
          color: var(--ink-faint);
        }

        .send-btn {
          background: var(--accent);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s ease, transform 0.12s ease, opacity 0.15s ease;
        }

        .send-btn:disabled {
          opacity: 0.35;
        }

        .send-btn:not(:disabled):hover {
          background: var(--accent-strong);
        }

        .send-btn:not(:disabled):active {
          transform: scale(0.92);
        }
      `}</style>
    </div>
  );
}
