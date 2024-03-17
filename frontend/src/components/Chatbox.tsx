import { useState, useEffect } from "react";
import axios from "axios";
import Title from "./ChatBoxTitle";
import RecordChat from "./RecordChat";
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
  const [voiceId, setVoiceId] = useState<string | null>(null);

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

      const chatbotRef = ref(db, `users/${userId}/chatbots/${chatbotId}`);
      onValue(chatbotRef, (snapshot) => {
        const chatbotData = snapshot.val();
        if (chatbotData) {
          const voiceId = chatbotData.voice_id;
          console.log("Voice ID: ", voiceId);
          setVoiceId(voiceId);
        } else {
          console.log("No Chatbot data");
        }
      });
    }
  }, [chatbotId]);

  const sendMessage = async (message: string, voiceId: string | null) => {
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
          "https://neochatbot-2.onrender.com/post-text/",
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

          const audioResponse = await fetch(
            "https://neochatbot-2.onrender.com//convert-text-to-speech/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Add Authorization header if your /convert-text-to-speech/ endpoint requires it
              },
              body: JSON.stringify({
                text: response.data.bot_response,
                voice_id: voiceId,
              }),
            }
          );

          if (!audioResponse.ok) {
            throw new Error("Failed to convert text to speech.");
          }

          const audioBlob = await audioResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        }
      }
    } catch (error) {
      console.error("Failed to send message or convert text to speech:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioStop = async (blobUrl: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("file", blob, "myFile.wav");

      const axiosResponse = await axios.post(
        "https://neochatbot-2.onrender.com/post-audio",
        formData
      );
      const messageDecoded = axiosResponse.data.message;

      if (messageDecoded) {
        console.log(messageDecoded);

        sendMessage(messageDecoded, voiceId);
      } else {
        console.log("No decoded message received from the backend.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
          onKeyPress={(e) => e.key === "Enter" && sendMessage(message, voiceId)}
        />
        <button
          onClick={() => sendMessage(message, voiceId)}
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
