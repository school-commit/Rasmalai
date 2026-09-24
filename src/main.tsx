import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { SplashScreen } from "./components/SplashScreen";
import { loadUserProfile, saveUserProfile, type UserProfile } from "./utils/profile";
import "./styles/global.css";

function Root() {
  const [showSplash, setShowSplash] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(() => loadUserProfile());

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  if (!profile) {
    return (
      <OnboardingScreen
        onComplete={(nextProfile) => {
          saveUserProfile(nextProfile);
          setProfile(nextProfile);
        }}
      />
    );
  }

  return <App profile={profile} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
