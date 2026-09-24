import { useCallback, useEffect, useState } from "react";
import type { AppSettings } from "../utils/types";
import { loadSettings, saveSettings } from "../utils/storage";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const mode = settings.theme;
      const resolved =
        mode === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : mode;
      root.setAttribute("data-theme", resolved);
    };
    applyTheme();

    if (settings.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", applyTheme);
      return () => mq.removeEventListener("change", applyTheme);
    }
  }, [settings.theme]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return { settings, updateSettings };
}
