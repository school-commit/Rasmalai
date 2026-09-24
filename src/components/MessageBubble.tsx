import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import type { Message } from "../utils/types";
import { JyotiAvatar } from "./JyotiAvatar";

interface Props {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: Props) {
  const isUser = message.role === "user";
  const [displayedContent, setDisplayedContent] = useState(() =>
    isUser || !isStreaming ? message.content : ""
  );
  const targetRef = useRef(message.content);

  useEffect(() => {
    targetRef.current = message.content;

    if (isUser || !isStreaming) {
      setDisplayedContent(message.content);
      return;
    }

    if (message.content.length < displayedContent.length) {
      setDisplayedContent(message.content);
    }
  }, [message.content, isStreaming, isUser]);

  useEffect(() => {
    if (isUser || !isStreaming) return;

    let cancelled = false;
    let timer: number | undefined;

    const tick = () => {
      if (cancelled) return;
      const target = targetRef.current;
      setDisplayedContent((current) => {
        if (current.length >= target.length) return current;
        return target.slice(0, current.length + 1);
      });
      timer = window.setTimeout(tick, 4);
    };

    timer = window.setTimeout(tick, 4);
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [isStreaming, isUser]);

  useEffect(() => {
    if (isStreaming || isUser) return;
    setDisplayedContent(message.content);
  }, [isStreaming, isUser, message.content]);

  const safeContent = DOMPurify.sanitize(displayedContent, { ALLOWED_TAGS: [] });

  return (
    <div className={`msg-row ${isUser ? "msg-row-user" : "msg-row-ai"}`}>
      {!isUser && <JyotiAvatar size={30} />}

      <div className="msg-col">
        {!isUser && <span className="msg-name">Rasmalai</span>}
        <div className={`msg-bubble ${isUser ? "msg-bubble-user" : "msg-bubble-ai"}`}>
          <ReactMarkdown
            components={{
              a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            }}
          >
            {safeContent}
          </ReactMarkdown>
          {!isUser && isStreaming && (
            <span className="typing-caret" aria-hidden="true">▍</span>
          )}
        </div>
      </div>

      <style>{`
        .msg-row {
          display: flex; gap: 8px; align-items: flex-end; animation: msgIn 0.22s ease; max-width: 100%;
        }
        .msg-row-user { flex-direction: row-reverse; }
        .msg-col { display: flex; flex-direction: column; max-width: 78%; min-width: 0; }
        .msg-row-user .msg-col { align-items: flex-end; }
        .msg-name { font-size: 11.5px; color: var(--ink-faint); font-weight: 600; margin-bottom: 3px; margin-left: 4px; }
        .msg-bubble { padding: 11px 15px; font-size: 14.5px; line-height: 1.5; word-wrap: break-word; overflow-wrap: break-word; }
        .msg-bubble p { margin: 0 0 8px; }
        .msg-bubble p:last-child { margin-bottom: 0; }
        .msg-bubble ul, .msg-bubble ol { margin: 4px 0 8px; padding-left: 20px; }
        .msg-bubble code { background: rgba(0,0,0,0.08); padding: 1px 5px; border-radius: 5px; font-size: 13px; }
        .msg-bubble pre { background: rgba(0,0,0,0.85); color: #f3ecee; padding: 12px 14px; border-radius: 10px; overflow-x: auto; margin: 6px 0; }
        .msg-bubble pre code { background: none; padding: 0; color: inherit; }
        .msg-bubble-user { background: var(--user-bubble); color: var(--user-bubble-text); border-radius: var(--radius-lg) var(--radius-lg) 6px var(--radius-lg); }
        .msg-bubble-user code { background: rgba(255,255,255,0.2); }
        .msg-bubble-ai { background: var(--ai-bubble); border: 1px solid var(--ai-bubble-border); color: var(--ink); border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) 6px; }
        .typing-caret { display: inline-block; margin-left: 2px; opacity: .75; animation: caretBlink .55s step-end infinite; }
        @keyframes caretBlink { 50% { opacity: 0; } }
        @keyframes msgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
