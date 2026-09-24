export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export type ThemeMode = "light" | "dark" | "system";
export type ResponseStyle = "short" | "balanced" | "detailed";

export interface AppSettings {
  theme: ThemeMode;
  enterToSend: boolean;
  responseStyle: ResponseStyle;
}
