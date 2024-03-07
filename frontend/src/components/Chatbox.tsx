import { useState, useEffect } from "react";
import axios from "axios";
import Title from "./ChatBoxTitle";
import RecordChat from "./RecordChat"; // Make sure you have this component set up for recording
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
  }>({ userMessages: [], assistantMessages: [] });
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
      timestamp: new Date().toISOString(),
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
            timestamp: new Date().toISOString(),
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

  const handleAudioStop = async (blobUrl: string) => {
    setIsLoading(true);

    const myMessage = { sender: "me", blobUrl };

    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "myFile.wav");
        await axios
          .post("http://localhost:8000/post-audio", formData, {
            headers: {
              "Content-Type": "audio/mpeg",
            },
            responseType: "arraybuffer", // Set the response type to handle binary data
          })
          .then((res: any) => {
            const blob = res.data;
            const audio = new Audio();
          })
          .catch((err: any) => {
            console.error(err);
            setIsLoading(false);
          });
      });
  };

  return (
    <div className="h-screen overflow-y-hidden bg-black">
      <Title setMessages={setMessages} />
      <div className="flex flex-col h-5/6 overflow-y-scroll p-4 gap-2">
        {/* Messages display */}
        {[...messages.userMessages, ...messages.assistantMessages]
          .sort((a, b) => {
            const dateA = a.timestamp ? new Date(a.timestamp) : null;
            const dateB = b.timestamp ? new Date(b.timestamp) : null;
            return dateA && dateB ? dateA.getTime() - dateB.getTime() : 0;
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
      <div className="p-4 flex justify-between items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 mr-2"
          placeholder="Type your message here..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
        <RecordChat handleStop={handleAudioStop} />
      </div>
    </div>
  );
}

export default Chatbox;
