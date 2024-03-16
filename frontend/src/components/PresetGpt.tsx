import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, Auth } from "firebase/auth";
import {
  ref,
  onValue,
  getDatabase,
  Database,
  push,
  set,
} from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

interface ChatbotConfig {
  id: string;
  bot_name: string;
  language: string;
  personality: string;
  scene: string;
  specialization: string;
  voice_enabled: string;
}

const PresetGpt: React.FC = () => {
  const [interests, setInterests] = useState<string[]>([]);
  const [chatbotConfigs, setChatbotConfigs] = useState<ChatbotConfig[]>([]);
  const [openInterest, setOpenInterest] = useState<string | null>(null);
  const [openBotDetail, setOpenBotDetail] = useState<string | null>(null);

  useEffect(() => {
    const auth: Auth = getAuth();
    const database: Database = getDatabase();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const interestsRef = ref(database, `users/${user.uid}/interests`);
        onValue(interestsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setInterests(Object.values(data));
          } else {
            setInterests([]);
          }
        });
      }
    });
  }, []);

  const handleInterestClick = (interest: string): void => {
    setOpenInterest(openInterest === interest ? null : interest);
    const database: Database = getDatabase();
    const chatbotRef = ref(database, `presetGPT/${interest}`);
    onValue(chatbotRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const configs = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setChatbotConfigs(configs);
      } else {
        setChatbotConfigs([]);
      }
    });
  };

  const toggleBotDetails = (botId: string): void => {
    if (openBotDetail === botId) {
      setOpenBotDetail(null);
    } else {
      setOpenBotDetail(botId);
    }
  };

  const handleAddBotClick = (config: ChatbotConfig): void => {
    const auth: Auth = getAuth();
    const database: Database = getDatabase();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userChatbotsRef = ref(database, `users/${user.uid}/chatbots`);
        const newChatbotRef = push(userChatbotsRef);
        set(newChatbotRef, {
          ...config,
          id: newChatbotRef.key,
        })
          .then(() => {
            console.log(
              "Chatbot added successfully with Firebase-generated ID"
            );
          })
          .catch((error) => {
            console.error("Error adding chatbot:", error);
          });
      } else {
        console.log("User not signed in or user data not available");
      }
    });
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recommended GPTs</h2>
        <div className="flex flex-col space-y-2">
          {interests.map((interest, index) => (
            <div key={index} className="text-center">
              <button
                className="w-full bg-gray-300 p-2 rounded text-gray-800 flex justify-center cursor-pointer"
                onClick={() => handleInterestClick(interest)}
              >
                {interest}
              </button>
              {openInterest === interest &&
                chatbotConfigs.map((config, configIndex) => (
                  <div key={configIndex} className="mt-2">
                    <div className="flex justify-between items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                      <span>{config.bot_name}</span>
                      <FontAwesomeIcon
                        icon={faEllipsisH}
                        className="cursor-pointer"
                        onClick={() => toggleBotDetails(config.id)}
                      />
                    </div>
                    {openBotDetail === config.id && (
                      <div className="text-left text-sm p-2 bg-gray-200 rounded mt-2">
                        <p>Language: {config.language}</p>
                        <p>Personality: {config.personality}</p>
                        <p>Scene: {config.scene}</p>
                        <p>Specialization: {config.specialization}</p>
                        <p>Voice Enabled: {config.voice_enabled}</p>
                        <button
                          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                          onClick={() => handleAddBotClick(config)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="mr-2" />
                          Add to ChatBot List
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
          {interests.length === 0 && (
            <div className="text-gray-800">No interests found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresetGpt;
