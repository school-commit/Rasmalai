import { useCallback, useEffect, useRef, useState } from "react";
import type { Conversation, Message } from "../utils/types";
import { generateId } from "../utils/id";
import { generateTitle, loadConversations, saveConversations } from "../utils/storage";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations());
  const [activeId, setActiveId] = useState<string | null>(() => {
    const loaded = loadConversations();
    return loaded.length > 0 ? loaded.sort((a, b) => b.updatedAt - a.updatedAt)[0].id : null;
  });

  // Persist on every change.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveConversations(conversations);
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const createConversation = useCallback((): string => {
    const id = generateId();
    const now = Date.now();
    const newConvo: Conversation = {
      id,
      title: "New chat",
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    setConversations((prev) => [newConvo, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        setActiveId(null);
      }
    },
    [activeId]
  );

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveId(null);
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }, []);

  const addMessage = useCallback((conversationId: string, message: Message) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const isFirstUserMessage = c.messages.length === 0 && message.role === "user";
        return {
          ...c,
          messages: [...c.messages, message],
          updatedAt: Date.now(),
          title: isFirstUserMessage ? generateTitle(message.content) : c.title,
        };
      })
    );
  }, []);

  const updateLastMessage = useCallback((conversationId: string, content: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const messages = [...c.messages];
        const lastIdx = messages.length - 1;
        if (lastIdx < 0) return c;
        messages[lastIdx] = { ...messages[lastIdx], content };
        return { ...c, messages, updatedAt: Date.now() };
      })
    );
  }, []);

  return {
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
  };
}
