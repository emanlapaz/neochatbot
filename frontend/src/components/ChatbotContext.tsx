import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatbotContextType {
  chatbotId: string | null;
  setChatbotId: (id: string | null) => void;
  voiceId: string | null;
  setVoiceId: (id: string | null) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({
  children,
}) => {
  const [chatbotId, setChatbotId] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState<string | null>(null);

  return (
    <ChatbotContext.Provider
      value={{ chatbotId, setChatbotId, voiceId, setVoiceId }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
