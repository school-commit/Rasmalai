import { useState } from "react";
import { Plus, MessageSquare, Pencil, Trash2, Settings, Info, X, Check } from "lucide-react";
import type { Conversation } from "../utils/types";
import { groupByDate } from "../utils/storage";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onClearAll: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onClearAll,
  onOpenSettings,
  onOpenAbout,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const groups = groupByDate(conversations);

  function startRename(c: Conversation) {
    setEditingId(c.id);
    setEditValue(c.title);
  }

  function commitRename() {
    if (editingId && editValue.trim()) {
      onRenameChat(editingId, editValue.trim());
    }
    setEditingId(null);
  }

  return (
    <>
      {isOpen && <div className="sidebar-scrim" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <span className="sidebar-brand">✨ Rasmalai</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={17} />
          New Chat
        </button>

        <div className="sidebar-history scroll-thin">
          {groups.length === 0 && (
            <p className="sidebar-empty">No chats yet — start one! 🌸</p>
          )}

          {groups.map((group) => (
            <div key={group.label} className="history-group">
              <span className="history-label">{group.label}</span>
              {group.items.map((c) => (
                <div key={c.id} className={`history-item ${c.id === activeId ? "history-item-active" : ""}`}>
                  {editingId === c.id ? (
                    <input
                      className="rename-input"
                      value={editValue}
                      autoFocus
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onBlur={commitRename}
                    />
                  ) : (
                    <button className="history-item-main" onClick={() => onSelectChat(c.id)}>
                      <MessageSquare size={15} className="history-item-icon" />
                      <span className="history-item-title">{c.title}</span>
                    </button>
                  )}

                  {editingId !== c.id && (
                    <div className="history-item-actions">
                      <button
                        className="icon-btn-sm"
                        onClick={() => startRename(c)}
                        aria-label="Rename chat"
                      >
                        <Pencil size={13} />
                      </button>
                      {confirmDeleteId === c.id ? (
                        <button
                          className="icon-btn-sm icon-btn-danger"
                          onClick={() => {
                            onDeleteChat(c.id);
                            setConfirmDeleteId(null);
                          }}
                          aria-label="Confirm delete"
                        >
                          <Check size={13} />
                        </button>
                      ) : (
                        <button
                          className="icon-btn-sm"
                          onClick={() => setConfirmDeleteId(c.id)}
                          onBlur={() => setTimeout(() => setConfirmDeleteId(null), 150)}
                          aria-label="Delete chat"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-menu-item" onClick={onOpenSettings}>
            <Settings size={16} />
            Settings
          </button>
          <button className="sidebar-menu-item" onClick={onOpenAbout}>
            <Info size={16} />
            About Rasmalai
          </button>

          {confirmClearAll ? (
            <div className="clear-confirm">
              <span>Clear all chats? This can't be undone.</span>
              <div className="clear-confirm-actions">
                <button
                  className="clear-confirm-btn clear-confirm-danger"
                  onClick={() => {
                    onClearAll();
                    setConfirmClearAll(false);
                  }}
                >
                  Yes, clear
                </button>
                <button className="clear-confirm-btn" onClick={() => setConfirmClearAll(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="sidebar-menu-item sidebar-menu-danger"
              onClick={() => setConfirmClearAll(true)}
              disabled={conversations.length === 0}
            >
              <Trash2 size={16} />
              Clear All Chats
            </button>
          )}
        </div>
      </aside>

      <style>{`
        .sidebar-scrim {
          position: fixed;
          inset: 0;
          background: rgba(20, 14, 20, 0.4);
          backdrop-filter: blur(2px);
          z-index: 40;
          animation: fadeIn 0.18s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: min(300px, 84vw);
          background: var(--surface);
          border-right: 1px solid var(--border-soft);
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
          z-index: 50;
          padding-top: var(--safe-top);
          padding-bottom: var(--safe-bottom);
        }

        .sidebar-open {
          transform: translateX(0);
        }

        .sidebar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 8px;
        }

        .sidebar-brand {
          font-weight: 800;
          font-size: 16px;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: var(--ink-soft);
          width: 32px;
          height: 32px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          background: var(--surface-soft);
        }

        .new-chat-btn {
          margin: 8px 16px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px;
          border-radius: var(--radius-md);
          border: none;
          background: var(--accent);
          color: white;
          font-weight: 600;
          font-size: 14px;
          transition: transform 0.12s ease, background 0.15s ease;
        }

        .new-chat-btn:hover {
          background: var(--accent-strong);
        }

        .new-chat-btn:active {
          transform: scale(0.98);
        }

        .sidebar-history {
          flex: 1;
          overflow-y: auto;
          padding: 4px 10px;
        }

        .sidebar-empty {
          text-align: center;
          color: var(--ink-faint);
          font-size: 13px;
          margin-top: 24px;
        }

        .history-group {
          margin-bottom: 14px;
        }

        .history-label {
          display: block;
          font-size: 11.5px;
          color: var(--ink-faint);
          font-weight: 600;
          padding: 6px 8px 4px;
        }

        .history-item {
          display: flex;
          align-items: center;
          border-radius: var(--radius-sm);
          padding-right: 4px;
        }

        .history-item:hover {
          background: var(--surface-soft);
        }

        .history-item-active {
          background: var(--accent-soft);
        }

        .history-item-main {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          text-align: left;
          padding: 9px 8px;
          min-width: 0;
          color: var(--ink);
        }

        .history-item-icon {
          color: var(--ink-faint);
          flex-shrink: 0;
        }

        .history-item-title {
          font-size: 13.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .history-item-actions {
          display: flex;
          gap: 2px;
          flex-shrink: 0;
        }

        .icon-btn-sm {
          background: transparent;
          border: none;
          color: var(--ink-faint);
          width: 26px;
          height: 26px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn-sm:hover {
          background: var(--border-soft);
          color: var(--ink);
        }

        .icon-btn-danger {
          color: #d15a5a;
        }

        .rename-input {
          flex: 1;
          margin: 5px 8px;
          padding: 5px 8px;
          border-radius: 8px;
          border: 1px solid var(--accent);
          background: var(--surface);
          color: var(--ink);
          font-size: 13.5px;
          outline: none;
        }

        .sidebar-bottom {
          border-top: 1px solid var(--border-soft);
          padding: 10px;
        }

        .sidebar-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          padding: 10px 10px;
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          color: var(--ink);
          text-align: left;
        }

        .sidebar-menu-item:hover {
          background: var(--surface-soft);
        }

        .sidebar-menu-item:disabled {
          opacity: 0.4;
          cursor: default;
        }

        .sidebar-menu-item:disabled:hover {
          background: none;
        }

        .sidebar-menu-danger {
          color: #d15a5a;
        }

        .clear-confirm {
          padding: 10px;
          font-size: 12.5px;
          color: var(--ink-soft);
        }

        .clear-confirm-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .clear-confirm-btn {
          flex: 1;
          padding: 7px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--ink);
          font-size: 12.5px;
        }

        .clear-confirm-danger {
          background: #d15a5a;
          border-color: #d15a5a;
          color: white;
        }

        @media (min-width: 900px) {
          .sidebar {
            width: 280px;
          }
        }
      `}</style>
    </>
  );
}
