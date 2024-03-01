import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, Auth } from "firebase/auth";
import { ref, onValue, getDatabase, Database } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface ChatbotConfig {
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
      } else {
        console.log("User not signed in or user data not available");
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
        const configs = Object.keys(data).map((key) => data[key]);
        setChatbotConfigs(configs);
      } else {
        setChatbotConfigs([]);
      }
    });
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recommended GPTs</h2>
        <div className="flex flex-col space-y-2">
          {interests.length > 0 ? (
            interests.map((interest, index) => (
              <div key={index} className="text-center">
                <button
                  className="w-full bg-gray-300 p-2 rounded text-gray-800 flex justify-center cursor-pointer"
                  onClick={() => handleInterestClick(interest)}
                >
                  {interest}
                </button>
                {openInterest === interest &&
                  chatbotConfigs.map((config, configIndex) => (
                    <button
                      key={configIndex}
                      className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center"
                      onClick={() => {
                        console.log(`Selected bot: ${config.bot_name}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      {config.bot_name}
                    </button>
                  ))}
              </div>
            ))
          ) : (
            <div className="text-gray-800">No interests found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresetGpt;
