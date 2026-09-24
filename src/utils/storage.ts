import type { AppSettings, Conversation } from "./types";

const CHATS_KEY = "jyoti:conversations";
const SETTINGS_KEY = "jyoti:settings";

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(conversations));
  } catch {
    // Storage full or unavailable — fail silently, chat still works this session.
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  enterToSend: true,
  responseStyle: "balanced",
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

/** Generates a short chat title from the first user message. */
export function generateTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 40) return cleaned || "New chat";
  return cleaned.slice(0, 40).trimEnd() + "…";
}

export function groupByDate(conversations: Conversation[]): { label: string; items: Conversation[] }[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOfWeek = startOfToday - 6 * 86400000;

  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const thisWeek: Conversation[] = [];
  const older: Conversation[] = [];

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  for (const c of sorted) {
    if (c.updatedAt >= startOfToday) today.push(c);
    else if (c.updatedAt >= startOfYesterday) yesterday.push(c);
    else if (c.updatedAt >= startOfWeek) thisWeek.push(c);
    else older.push(c);
  }

  const groups = [
    { label: "Today", items: today },
    { label: "Yesterday", items: yesterday },
    { label: "This week", items: thisWeek },
    { label: "Older", items: older },
  ];

  return groups.filter((g) => g.items.length > 0);
}
