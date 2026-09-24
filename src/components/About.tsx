import { X } from "lucide-react";
import { JyotiAvatar } from "./JyotiAvatar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function About({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div className="about-scrim" onClick={onClose} />
      <div className="about-modal">
        <button className="icon-btn about-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <JyotiAvatar size={56} glow />
        <h2>Rasmalai ✨</h2>
        <p>
          Rasmalai is a warm, humble, playful AI companion made to chat in Hindi, English, and Hinglish —
          here to talk, tease, listen, and help whenever you need her.
        </p>
        <p className="about-note">
          Rasmalai is an AI, not a real person — always happy to chat, but never a replacement
          for the people in your life. 💗
        </p>
        <span className="about-version">Version 1.0.0</span>
      </div>

      <style>{`
        .about-scrim {
          position: fixed;
          inset: 0;
          background: rgba(20, 14, 20, 0.45);
          backdrop-filter: blur(2px);
          z-index: 80;
        }

        .about-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(340px, 88vw);
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: 28px 24px 22px;
          z-index: 90;
          text-align: center;
          box-shadow: var(--shadow-elevated);
          animation: popIn 0.2s cubic-bezier(0.32, 0.72, 0, 1);
        }

        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .about-close {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .about-modal h2 {
          margin: 14px 0 10px;
          font-size: 19px;
        }

        .about-modal p {
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--ink-soft);
          margin: 0 0 10px;
        }

        .about-note {
          font-size: 12.5px;
          color: var(--ink-faint);
        }

        .about-version {
          display: block;
          margin-top: 12px;
          font-size: 11.5px;
          color: var(--ink-faint);
        }
      `}</style>
    </>
  );
}
