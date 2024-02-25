import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context shape
interface ChatbotContextType {
  chatbotId: string | null;
  setChatbotId: (id: string | null) => void;
}

// Create the context with an empty initial value
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode; // Define the children prop
}

// Create a provider component
export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({
  children,
}) => {
  const [chatbotId, setChatbotId] = useState<string | null>(null);

  return (
    <ChatbotContext.Provider value={{ chatbotId, setChatbotId }}>
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook to use the context
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
