import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faEllipsisH,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

interface Chatbot {
  id: string;
  bot_name: string;
  scene: string;
  personality: string;
  language: string;
  specialization: string;
  voice_enabled: boolean;
}

function ChatBotList() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [openChatbotId, setOpenChatbotId] = useState<string | null>(null);
  const [openPlaceholderId, setOpenPlaceholderId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [openChatHistoryId, setOpenChatHistoryId] = useState<string | null>(
    null
  );

  const toggleChatHistory = (id: string) => {
    if (openChatHistoryId === id) {
      setOpenChatHistoryId(null);
    } else {
      setOpenChatHistoryId(id);
      setOpenPlaceholderId(null);
      setOpenChatbotId(null);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      const chatbotsRef = ref(db, `users/${user.uid}/chatbots`);
      onValue(chatbotsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedChatbots = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setChatbots(loadedChatbots);
        }
        setLoading(false);
      });
    }
  }, []);

  const togglePlaceholder = (id: string) => {
    setOpenPlaceholderId(openPlaceholderId === id ? null : id);
    setOpenChatbotId(null);
  };

  const toggleChatbotDetails = (id: string) => {
    setOpenChatbotId(openChatbotId === id ? null : id);
    setOpenPlaceholderId(null);
  };

  const loadChatbotDetails = async (chatbotId: string) => {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in.");
      }
      const userToken = await auth.currentUser.getIdToken(true);
      const response = await fetch("http://localhost:8000/load-chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ chatbot_id: chatbotId }),
      });
      if (!response.ok) {
        throw new Error("Failed to load chatbot details");
      }
      const details = await response.json();
      console.log(details); // Process chatbot details as needed
    } catch (error) {
      console.error("Error loading chatbot:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ChatBot List</h2>
      <div className="grid grid-cols-1 gap-4">
        {chatbots.map((chatbot) => (
          <div key={chatbot.id} className="bg-white border rounded relative">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div className="flex-grow">
                  <button
                    onClick={() => togglePlaceholder(chatbot.id)}
                    className="text-left focus:outline-none"
                  >
                    {chatbot.bot_name}
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => loadChatbotDetails(chatbot.id)}
                  className="bg-gray-200 text-sm p-1 rounded flex items-center justify-center mr-2"
                  title="Load Chatbot"
                >
                  <span className="ml-1">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  </span>
                </button>

                <button
                  className="p-2 rounded-full hover:bg-gray-200"
                  title="Details"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleChatbotDetails(chatbot.id);
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsisH} />
                </button>
              </div>
            </div>
            {openPlaceholderId === chatbot.id && (
              <div className="p-4 border-t">
                <p>
                  <strong>Chat History:</strong>
                </p>
                {/* Placeholder for chat history or other dynamic content */}
              </div>
            )}
            {openChatbotId === chatbot.id && (
              <div className="p-4 border-t">
                <p>
                  <strong>Details:</strong>
                </p>
                <p>Scene: {chatbot.scene}</p>
                <p>Personality: {chatbot.personality}</p>
                <p>Language: {chatbot.language}</p>
                <p>Specialization: {chatbot.specialization}</p>
                <p>Voice Enabled: {chatbot.voice_enabled ? "Yes" : "No"}</p>
                <div className="flex justify-end items-end mt-4">
                  <button className="mr-6">
                    <FontAwesomeIcon icon={faEdit} style={{ color: "green" }} />
                  </button>
                  <button>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      style={{ color: "red" }}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatBotList;
