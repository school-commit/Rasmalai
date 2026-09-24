import { X } from "lucide-react";
import type { AppSettings, Conversation, ResponseStyle, ThemeMode } from "../utils/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  conversations: Conversation[];
  onClearAll: () => void;
}

const THEMES: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const STYLES: { value: ResponseStyle; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
];

export function Settings({ isOpen, onClose, settings, onUpdateSettings, conversations, onClearAll }: Props) {
  if (!isOpen) return null;

  function handleExport() {
    const blob = new Blob([JSON.stringify(conversations, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jyoti-chats-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="settings-scrim" onClick={onClose} />
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            <X size={18} />
          </button>
        </div>

        <div className="settings-body scroll-thin">
          <section className="settings-section">
            <h3>Appearance</h3>
            <div className="segmented">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  className={`segment ${settings.theme === t.value ? "segment-active" : ""}`}
                  onClick={() => onUpdateSettings({ theme: t.value })}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>Chat</h3>
            <label className="toggle-row">
              <span>Enter to send</span>
              <input
                type="checkbox"
                checked={settings.enterToSend}
                onChange={(e) => onUpdateSettings({ enterToSend: e.target.checked })}
              />
            </label>
          </section>

          <section className="settings-section">
            <h3>AI response style</h3>
            <div className="segmented">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  className={`segment ${settings.responseStyle === s.value ? "segment-active" : ""}`}
                  onClick={() => onUpdateSettings({ responseStyle: s.value })}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>Data</h3>
            <button className="settings-action-btn" onClick={handleExport} disabled={conversations.length === 0}>
              Export chats (.json)
            </button>
            <button className="settings-action-btn settings-action-danger" onClick={onClearAll} disabled={conversations.length === 0}>
              Clear all chats
            </button>
          </section>

          <section className="settings-section">
            <h3>About</h3>
            <p className="about-text">Rasmalai ✨ — your warm, humble, playful AI companion.</p>
            <p className="version-text">Version 1.0.0</p>
          </section>
        </div>
      </div>

      <style>{`
        .settings-scrim {
          position: fixed;
          inset: 0;
          background: rgba(20, 14, 20, 0.4);
          backdrop-filter: blur(2px);
          z-index: 60;
        }

        .settings-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(360px, 92vw);
          background: var(--surface);
          z-index: 70;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-elevated);
          padding-top: var(--safe-top);
          padding-bottom: var(--safe-bottom);
          animation: slideIn 0.22s cubic-bezier(0.32, 0.72, 0, 1);
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--border-soft);
        }

        .settings-header h2 {
          font-size: 16px;
          margin: 0;
        }

        .settings-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .settings-section {
          margin-bottom: 22px;
        }

        .settings-section h3 {
          font-size: 12.5px;
          text-transform: none;
          color: var(--ink-faint);
          font-weight: 600;
          margin: 0 0 10px;
        }

        .segmented {
          display: flex;
          background: var(--surface-soft);
          border-radius: var(--radius-md);
          padding: 3px;
          gap: 3px;
        }

        .segment {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px;
          border-radius: 10px;
          font-size: 13px;
          color: var(--ink-soft);
        }

        .segment-active {
          background: var(--surface);
          color: var(--ink);
          font-weight: 600;
          box-shadow: var(--shadow-soft);
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding: 4px 2px;
        }

        .toggle-row input {
          width: 18px;
          height: 18px;
        }

        .settings-action-btn {
          width: 100%;
          text-align: left;
          background: var(--surface-soft);
          border: 1px solid var(--border-soft);
          padding: 11px 12px;
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          color: var(--ink);
          margin-bottom: 8px;
        }

        .settings-action-btn:disabled {
          opacity: 0.4;
        }

        .settings-action-danger {
          color: #d15a5a;
        }

        .about-text {
          font-size: 13.5px;
          color: var(--ink-soft);
          margin: 0 0 4px;
        }

        .version-text {
          font-size: 12px;
          color: var(--ink-faint);
          margin: 0;
        }
      `}</style>
    </>
  );
}
