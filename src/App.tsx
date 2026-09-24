import { useCallback, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { Settings } from "./components/Settings";
import { About } from "./components/About";
import { useConversations } from "./hooks/useConversations";
import { useSettings } from "./hooks/useSettings";
import { sendMessage, ApiError } from "./services/api";
import { generateId } from "./utils/id";
import type { Message } from "./utils/types";
import type { UserProfile } from "./utils/profile";

const FRIENDLY_ERRORS: Record<ApiError["kind"], string> = {
  network: "Oops 😭 lagta hai connection mein thoda issue hai. Ek baar phir try karo na 😅",
  auth: "Arey, server ne request authorize nahi ki 🥺 thodi der baad phir try karo.",
  rate_limit: "Thoda slow down 😅 rate limit lag gayi hai — thodi der mein try karo!",
  timeout: "Response aane mein zyada time lag gaya 😭 ek baar phir try karo?",
  invalid_response: "Kuch ajeeb response aaya server se 🤔 ek baar phir try karo na.",
  not_configured: "Rasmalai abhi API se connected nahi hai 🌸 API URL check karke phir try karo.",
  unknown: "Oops 😭 lagta hai server ne thoda nakhra kar diya. Ek baar phir try karo na 😅",
};

export default function App({ profile }: { profile: UserProfile }) {
  const {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    createConversation,
    deleteConversation,
    clearAllConversations,
    renameConversation,
    addMessage,
    updateLastMessage,
  } = useConversations();

  const { settings, updateSettings } = useSettings();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isWaitingForFirstToken, setIsWaitingForFirstToken] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [prefillText, setPrefillText] = useState<string | undefined>(undefined);

  const lastFailedInputRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isBusy = isWaitingForFirstToken || isStreaming;

  const handleSend = useCallback(
    async (text: string) => {
      setErrorMessage(null);
      let conversationId = activeId;
      if (!conversationId) {
        conversationId = createConversation();
      }

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };
      addMessage(conversationId, userMessage);

      // Placeholder assistant message we'll stream into.
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      setIsWaitingForFirstToken(true);
      lastFailedInputRef.current = null;

      const controller = new AbortController();
      abortRef.current = controller;

      // Build the history to send: existing messages + the new user message.
      const priorMessages = conversations.find((c) => c.id === conversationId)?.messages ?? [];
      const historyForApi = [...priorMessages, userMessage];

      let addedAssistantPlaceholder = false;

      try {
        await sendMessage(historyForApi, settings.responseStyle, profile, {
          signal: controller.signal,
          onToken: (textSoFar) => {
            if (!addedAssistantPlaceholder) {
              addMessage(conversationId!, { ...assistantMessage, content: textSoFar });
              addedAssistantPlaceholder = true;
              setIsWaitingForFirstToken(false);
              setIsStreaming(true);
            } else {
              updateLastMessage(conversationId!, textSoFar);
            }
          },
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // user cancelled — no error message needed
        } else if (err instanceof ApiError) {
          setErrorMessage(FRIENDLY_ERRORS[err.kind]);
          lastFailedInputRef.current = text;
        } else {
          setErrorMessage(FRIENDLY_ERRORS.unknown);
          lastFailedInputRef.current = text;
        }
      } finally {
        setIsWaitingForFirstToken(false);
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [activeId, conversations, createConversation, addMessage, updateLastMessage, settings.responseStyle, profile]
  );

  const handleRetry = useCallback(() => {
    const text = lastFailedInputRef.current;
    if (text) {
      setErrorMessage(null);
      handleSend(text);
    }
  }, [handleSend]);

  const handleNewChat = useCallback(() => {
    createConversation();
    setSidebarOpen(false);
  }, [createConversation]);

  const handleSelectChat = useCallback(
    (id: string) => {
      setActiveId(id);
      setSidebarOpen(false);
      setErrorMessage(null);
    },
    [setActiveId]
  );

  return (
    <div className="app-shell">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={deleteConversation}
        onRenameChat={renameConversation}
        onClearAll={clearAllConversations}
        onOpenSettings={() => {
          setSettingsOpen(true);
          setSidebarOpen(false);
        }}
        onOpenAbout={() => {
          setAboutOpen(true);
          setSidebarOpen(false);
        }}
      />

      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        conversations={conversations}
        onClearAll={clearAllConversations}
      />

      <About isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      <ChatWindow
        messages={activeConversation?.messages ?? []}
        isStreaming={isStreaming}
        isWaitingForFirstToken={isWaitingForFirstToken}
        errorMessage={errorMessage}
        onRetry={handleRetry}
        onSuggestionClick={(text) => setPrefillText(text)}
        profile={profile}
      />

      <ChatInput
        onSend={handleSend}
        disabled={isBusy}
        enterToSend={settings.enterToSend}
        prefillText={prefillText}
        onPrefillConsumed={() => setPrefillText(undefined)}
      />

      <style>{`
        .app-shell {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          max-height: 100dvh;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
