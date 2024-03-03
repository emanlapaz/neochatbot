import { useState, useEffect } from "react";
import axios from "axios";
import Title from "./ChatBoxTitle";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { useChatbot } from "./ChatbotContext";

interface Message {
  sender: string;
  content: string;
  timestamp?: string;
}

function Chatbox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{
    userMessages: Message[];
    assistantMessages: Message[];
  }>({
    userMessages: [],
    assistantMessages: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { chatbotId } = useChatbot();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && chatbotId) {
      const userId = user.uid;
      const db = getDatabase();
      const chatHistoryRef = ref(
        db,
        `users/${userId}/chatbots/${chatbotId}/chats`
      );

      onValue(chatHistoryRef, (snapshot) => {
        const chats = snapshot.val() || {};
        const userMessages: Message[] = [];
        const assistantMessages: Message[] = [];

        Object.keys(chats).forEach((key) => {
          const chat = chats[key];
          const formattedMessage: Message = {
            sender: chat.sender,
            content: chat.content,
            timestamp: chat.timestamp,
          };

          if (chat.sender === "user") {
            userMessages.push(formattedMessage);
          } else if (chat.sender === "bot") {
            assistantMessages.push(formattedMessage);
          }
        });

        setMessages({ userMessages, assistantMessages });
      });
    }
  }, [chatbotId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    const userMessage = {
      sender: "user",
      content: message,
      timestamp: new Date().toISOString(), // Add current timestamp
    };

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && chatbotId) {
        const userId = user.uid;
        const db = getDatabase();
        const chatRef = ref(db, `users/${userId}/chatbots/${chatbotId}/chats`);
        await push(chatRef, userMessage);

        const token = await user.getIdToken();
        const response = await axios.post(
          "http://localhost:8000/post-text/",
          { text: message, chatbotId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.bot_response) {
          const botMessage = {
            sender: "bot",
            content: response.data.bot_response,
            timestamp: new Date().toISOString(), // Add current timestamp for bot message
          };
          await push(chatRef, botMessage);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setMessage(""); // Clear the input field
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="h-screen overflow-y-hidden bg-black">
      <Title setMessages={setMessages} />
      <div className="flex flex-col h-5/6 overflow-y-scroll p-4 gap-2">
        {[...messages.userMessages, ...messages.assistantMessages]
          .sort((a, b) => {
            const dateA = a.timestamp ? new Date(a.timestamp) : null;
            const dateB = b.timestamp ? new Date(b.timestamp) : null;
            if (!dateA && !dateB) return 0; // If both timestamps are null
            if (!dateA) return 1; // If A is null, place it after B
            if (!dateB) return -1; // If B is null, place it after A
            return dateA.getTime() - dateB.getTime();
          })
          .map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex flex-col">
                <p
                  className={`message-content ${
                    msg.sender === "user" ? "bg-blue-500" : "bg-gray-500"
                  } text-white rounded-lg p-2`}
                >
                  {msg.content}
                </p>
                <span className="text-gray-400 text-xs">
                  {msg.timestamp &&
                    new Date(msg.timestamp).toLocaleDateString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>
            </div>
          ))}
        {isLoading && (
          <div className="flex justify-center">
            <p className="text-white">Waiting for reply...</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Type your message here..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbox;
