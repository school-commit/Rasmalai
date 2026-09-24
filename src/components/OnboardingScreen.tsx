import { useState } from "react";
import { User, Sparkles } from "lucide-react";
import type { UserGender, UserProfile } from "../utils/profile";

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<UserGender | "">("");
  const canContinue = name.trim().length > 0 && nickname.trim().length > 0 && !!gender;

  function submit() {
    if (!canContinue) return;
    onComplete({
      name: name.trim(),
      nickname: nickname.trim(),
      gender: gender as UserGender,
    });
  }

  return (
    <main className="onboarding-screen">
      <div className="onboarding-card">
        <div className="onboarding-icon"><Sparkles size={21} /></div>
        <h1>Hey! 👋</h1>
        <p className="onboarding-sub">
          Main Rasmalai hoon ✨ Pehli baar mil rahe hain, toh thoda sa introduction ho jaaye?
        </p>

        <label className="onboarding-label" htmlFor="name">Your name</label>
        <div className="onboarding-input-wrap">
          <User size={17} />
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Apna naam batao"
            maxLength={60}
            autoComplete="name"
          />
        </div>

        <label className="onboarding-label" htmlFor="nickname">Nickname</label>
        <div className="onboarding-input-wrap">
          <span className="nickname-symbol">♡</span>
          <input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Main tumhe kis naam se bulaun?"
            maxLength={40}
          />
        </div>

        <div className="onboarding-label">Gender</div>
        <div className="gender-row">
          <button
            type="button"
            className={`gender-btn ${gender === "male" ? "selected" : ""}`}
            onClick={() => setGender("male")}
            aria-pressed={gender === "male"}
          >
            Male
          </button>
          <button
            type="button"
            className={`gender-btn ${gender === "female" ? "selected" : ""}`}
            onClick={() => setGender("female")}
            aria-pressed={gender === "female"}
          >
            Female
          </button>
        </div>

        <button className="continue-btn" disabled={!canContinue} onClick={submit}>
          Let's go ✨
        </button>
        <p className="save-note">Ye details isi device par save rahengi, taaki main baar-baar na puchun. 🔒</p>
      </div>

      <style>{`
        .onboarding-screen {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: calc(24px + var(--safe-top)) 18px calc(24px + var(--safe-bottom));
          background:
            radial-gradient(circle at 50% 18%, rgba(217, 119, 87, 0.16), transparent 30%),
            var(--bg);
          color: var(--ink);
        }
        .onboarding-card {
          width: min(420px, 100%);
          padding: 28px 22px 22px;
          background: var(--surface);
          border: 1px solid var(--border-soft);
          border-radius: 24px;
          box-shadow: var(--shadow-elevated);
          animation: onboardingIn .35s ease both;
        }
        .onboarding-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: var(--accent-strong);
          background: var(--accent-soft);
          margin-bottom: 14px;
        }
        .onboarding-card h1 { margin: 0 0 7px; font-size: 25px; }
        .onboarding-sub { margin: 0 0 22px; color: var(--ink-soft); font-size: 13.5px; line-height: 1.55; }
        .onboarding-label { display: block; margin: 14px 0 7px; font-size: 12px; font-weight: 700; color: var(--ink-soft); }
        .onboarding-input-wrap {
          display: flex; align-items: center; gap: 9px;
          min-height: 46px; padding: 0 13px;
          border: 1px solid var(--border); border-radius: 14px;
          background: var(--surface-soft); color: var(--ink-faint);
        }
        .onboarding-input-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
        .onboarding-input-wrap input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--ink); font-size: 14px; }
        .onboarding-input-wrap input::placeholder { color: var(--ink-faint); }
        .nickname-symbol { width: 17px; text-align: center; font-size: 18px; }
        .gender-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .gender-btn {
          min-height: 44px; border-radius: 13px; border: 1px solid var(--border);
          background: var(--surface-soft); color: var(--ink); font-weight: 650;
        }
        .gender-btn.selected { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-strong); }
        .continue-btn {
          width: 100%; margin-top: 22px; min-height: 47px; border: 0; border-radius: 15px;
          background: var(--accent); color: white; font-size: 14px; font-weight: 750;
          transition: transform .12s ease, opacity .15s ease, background .15s ease;
        }
        .continue-btn:not(:disabled):active { transform: scale(.985); }
        .continue-btn:disabled { opacity: .45; cursor: not-allowed; }
        .save-note { margin: 11px 4px 0; text-align: center; color: var(--ink-faint); font-size: 10.5px; line-height: 1.45; }
        @keyframes onboardingIn { from { opacity: 0; transform: translateY(10px) scale(.99); } to { opacity: 1; transform: none; } }
      `}</style>
    </main>
  );
}
