interface Props {
  onFinished: () => void;
}

const LAUNCH_WORDS = ["Launching", "Your", "AI..."];

export function SplashScreen({ onFinished }: Props) {
  // The parent controls the 3-second lifetime. This callback is kept in the
  // component API so the splash remains easy to reuse if needed later.
  void onFinished;

  return (
    <main className="splash-screen" aria-label="Launching Rasmalai">
      <div className="splash-content">
        <div className="splash-launch-text" aria-hidden="true">
          {LAUNCH_WORDS.map((word, index) => (
            <span
              key={word}
              className="splash-word"
              style={{ animationDelay: `${index * 0.45}s` }}
            >
              {word}
            </span>
          ))}
        </div>

        <img
          className="splash-logo"
          src="/jyoti-logo.jpg"
          alt="Rasmalai logo"
        />

        <div className="splash-name">RASMALAI</div>
        <div className="splash-credit">MADE WITH ❤️‍🩹 BY ADITYA IN 🇮🇳</div>
      </div>

      <style>{`
        .splash-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          min-height: 100dvh;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 42%, rgba(217, 119, 87, 0.18), transparent 30%),
            linear-gradient(145deg, #1e1720 0%, #2b202b 52%, #171218 100%);
          color: #fff8f5;
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 28px;
        }

        .splash-launch-text {
          min-height: 32px;
          margin-bottom: 26px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          justify-content: center;
          font-family: "Courier New", "Liberation Mono", monospace;
          font-size: clamp(15px, 4vw, 21px);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 248, 245, 0.9);
        }

        .splash-word {
          opacity: 0;
          transform: translateY(7px);
          animation: splashWordIn 0.55s ease forwards;
        }

        .splash-logo {
          width: clamp(145px, 42vw, 190px);
          height: clamp(145px, 42vw, 190px);
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid rgba(255, 248, 245, 0.82);
          box-shadow:
            0 0 0 8px rgba(255, 255, 255, 0.045),
            0 18px 55px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(217, 119, 87, 0.26);
          animation: splashLogoIn 0.8s cubic-bezier(.2,.8,.2,1) both;
        }

        .splash-name {
          margin-top: 17px;
          font-size: clamp(27px, 7vw, 38px);
          font-weight: 800;
          letter-spacing: 0.34em;
          padding-left: 0.34em;
          color: #fff8f5;
          text-shadow: 0 4px 20px rgba(0,0,0,.28);
        }

        .splash-credit {
          margin-top: 11px;
          font-size: 12px;
          letter-spacing: 0.02em;
          color: rgba(255, 248, 245, 0.64);
        }

        @keyframes splashWordIn {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-word,
          .splash-logo {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}
