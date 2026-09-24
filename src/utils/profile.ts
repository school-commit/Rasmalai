export type UserGender = "male" | "female";

export interface UserProfile {
  name: string;
  nickname: string;
  gender: UserGender;
}

const PROFILE_KEY = "rasmalai:user-profile";

export function loadUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed.name !== "string" ||
      typeof parsed.nickname !== "string" ||
      (parsed.gender !== "male" && parsed.gender !== "female")
    ) {
      return null;
    }
    return {
      name: parsed.name.trim(),
      nickname: parsed.nickname.trim(),
      gender: parsed.gender,
    };
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // The app can still work for the current session if storage is unavailable.
  }
}
