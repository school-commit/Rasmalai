import { JyotiAvatar } from "./JyotiAvatar";
import type { UserProfile } from "../utils/profile";

interface Props {
  onSuggestionClick: (text: string) => void;
  profile: UserProfile;
}

const SUGGESTIONS = [
  { emoji: "💬", text: "Aaj ka mood kaisa hai?" },
  { emoji: "🌸", text: "Mujhe kuch interesting batao" },
  { emoji: "😂", text: "Thoda timepass karein?" },
  { emoji: "🧠", text: "Kuch naya seekhna hai" },
];

export function WelcomeScreen({ onSuggestionClick, profile }: Props) {
  return (
    <div className="welcome">
      <div className="welcome-avatar"><JyotiAvatar size={64} glow /></div>
      <h1 className="welcome-heading">Hi {profile.nickname} Babu! 👋</h1>
      <p className="welcome-sub">
        Main Rasmalai hoon ✨
        <br />
        Batao, aaj kya baat karni hai? 😊
      </p>
      <div className="welcome-suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s.text} className="suggestion-card" onClick={() => onSuggestionClick(s.text)}>
            <span className="suggestion-emoji">{s.emoji}</span>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
      <style>{`
        .welcome { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; max-width: 480px; margin: 0 auto; }
        .welcome-avatar { margin-bottom: 18px; }
        .welcome-heading { font-size: 22px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.01em; }
        .welcome-sub { color: var(--ink-soft); font-size: 14.5px; line-height: 1.6; margin: 0 0 28px; }
        .welcome-suggestions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
        .suggestion-card { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--radius-md); padding: 13px 12px; font-size: 12.5px; color: var(--ink); text-align: left; line-height: 1.35; box-shadow: var(--shadow-soft); transition: transform 0.12s ease, border-color 0.15s ease; }
        .suggestion-card:hover { border-color: var(--accent); transform: translateY(-1px); }
        .suggestion-card:active { transform: scale(0.98); }
        .suggestion-emoji { font-size: 18px; flex-shrink: 0; }
        @media (max-width: 380px) { .welcome-suggestions { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
