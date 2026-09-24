import { Menu } from "lucide-react";

interface Props {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: Props) {
  return (
    <header className="header">
      <button className="header-icon-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="header-title">
        <span className="header-title-text">Rasmalai ✨</span>
        <span className="header-subtitle">Your friendly AI companion</span>
      </div>

      <div className="header-status" title="Online">
        <span className="status-dot" />
        <span className="status-label">Online</span>
      </div>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: calc(12px + var(--safe-top)) 14px 12px;
          background: var(--bg-elevated);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-soft);
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .header-icon-btn {
          background: transparent;
          border: none;
          color: var(--ink);
          width: 38px;
          height: 38px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
          flex-shrink: 0;
        }

        .header-icon-btn:hover {
          background: var(--surface-soft);
        }

        .header-icon-btn:active {
          transform: scale(0.94);
        }

        .header-title {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;
        }

        .header-title-text {
          font-weight: 700;
          font-size: 17px;
          letter-spacing: -0.01em;
        }

        .header-subtitle {
          font-size: 11.5px;
          color: var(--ink-faint);
          margin-top: 1px;
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          padding-right: 2px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #5cb87a;
          box-shadow: 0 0 0 3px rgba(92, 184, 122, 0.18);
        }

        .status-label {
          font-size: 11.5px;
          color: var(--ink-faint);
          display: none;
        }

        @media (min-width: 480px) {
          .status-label {
            display: inline;
          }
        }
      `}</style>
    </header>
  );
}
