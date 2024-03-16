import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";

interface CreateBotState {
  bot_name: string;
  scene: string;
  personality: string;
  language: string;
  specialization: string;
  voice_enabled: string;
  voice_name: string;
}

interface VoiceOption {
  voice_id: string;
  name: string;
  labels: {
    accent: string;
    description: string;
    age: string;
    gender: string;
  };
}

const CreateBot: React.FC = () => {
  const [chatbots, setChatbots] = useState<CreateBotState>({
    bot_name: "",
    scene: "",
    personality: "",
    language: "",
    specialization: "",
    voice_enabled: "No",
    voice_name: "",
  });

  const [voiceOptions, setVoiceOptions] = useState<VoiceOption[]>([
    {
      voice_id: "EXAVITQu4vr4xnSDxMaL",
      name: "Sarah",
      labels: {
        accent: "American",
        description: "Soft",
        age: "Young",
        gender: "Female",
      },
    },
    {
      voice_id: "EGBv7mTt0atIp3Br8iCZE",
      name: "Thomas",
      labels: {
        accent: "American",
        description: "Calm",
        age: "Young",
        gender: "Male",
      },
    },
    {
      voice_id: "IKne3meq5aSn9XLyUdCD",
      name: "Charlie",
      labels: {
        accent: "Australian",
        description: "Casual",
        age: "Middle aged",
        gender: "Male",
      },
    },
    {
      voice_id: "LcfcDJNUP1GQjkzn1xUU",
      name: "Emily",
      labels: {
        accent: "American",
        description: "Calm",
        age: "Young",
        gender: "Female",
      },
    },
    {
      voice_id: "MF3mGyEYCl7XYWbV9V6O",
      name: "Elli",
      labels: {
        accent: "American",
        description: "Emotional",
        age: "Young",
        gender: "Female",
      },
    },
    {
      voice_id: "N2lVS1w4EtoT3dr4eOWO",
      name: "Callum",
      labels: {
        accent: "American",
        description: "Hoarse",
        age: "Middle aged",
        gender: "Male",
      },
    },
    {
      voice_id: "D38z5RcWu1voky8WS1ja",
      name: "Fin",
      labels: {
        accent: "Irish",
        description: "Sailor",
        age: "Old",
        gender: "Male",
      },
    },
    {
      voice_id: "JBFqnCBsd6RMkjVDRZzb",
      name: "George",
      labels: {
        accent: "british",
        description: "raspy",
        age: "middle aged",
        gender: "male",
      },
    },
  ]);

  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUserToken(token);
        setUserId(user.uid);
      }
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setChatbots((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userToken || !userId) {
      console.error("User is not authenticated");
      return;
    }

    const selectedVoiceOption = voiceOptions.find(
      (option) => option.voice_id === chatbots.voice_name
    );

    const submissionPayload = {
      ...chatbots,
      user_id: userId,
      voice_enabled: chatbots.voice_enabled === "Yes",

      voice_id:
        chatbots.voice_enabled === "Yes" ? selectedVoiceOption?.voice_id : null,
      voice_name:
        chatbots.voice_enabled === "Yes" ? selectedVoiceOption?.name : null,
    };
    console.log(
      `Submitting with voice ID: ${submissionPayload.voice_id}, Voice Name: ${submissionPayload.voice_name}`
    );

    try {
      await axios.post(
        "http://localhost:8000/create-chatbot/",
        submissionPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      console.log("Create Bot successful");
    } catch (error) {
      console.error("Error during creating bot:", error);
    }
  };

  return (
    <div>
      {" "}
      <h2 className="text-xl font-bold mb-4">Create</h2>
      <form
        className="p-4 bg-gray-100 rounded-lg shadow"
        onSubmit={handleSubmit}
        style={{ maxWidth: "320px" }}
      >
        <div className="flex flex-col space-y-4">
          <label>
            Bot Name:
            <input
              className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
              placeholder="Bot Name"
              name="bot_name"
              value={chatbots.bot_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Scene:
            <input
              className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
              placeholder="Scene"
              name="scene"
              value={chatbots.scene}
              onChange={handleChange}
            />
          </label>
          <label>
            Personality:
            <select
              className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
              name="personality"
              value={chatbots.personality}
              onChange={handleChange}
            >
              <option value="">Select Personality</option>
              <option value="Friendly">Friendly</option>
              <option value="Professional">Professional</option>
              <option value="Humorous">Humorous</option>
              <option value="Enthusiastic">Enthusiastic</option>
              <option value="Informative">Informative</option>
            </select>
          </label>
          <label>
            Language:
            <select
              className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
              name="language"
              value={chatbots.language}
              onChange={handleChange}
            >
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Mandarin">Mandarin</option>
            </select>
          </label>
          <label>
            Specialization:
            <input
              className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
              placeholder="Specialization"
              name="specialization"
              value={chatbots.specialization}
              onChange={handleChange}
            />
          </label>
          <label>
            Enable Voice:
            <select
              className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
              name="voice_enabled"
              value={chatbots.voice_enabled}
              onChange={handleChange}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </label>
          {chatbots.voice_enabled === "Yes" && (
            <label>
              Voice Name:
              <select
                className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
                name="voice_name"
                value={chatbots.voice_name}
                onChange={handleChange}
              >
                <option value="">Select a Voice</option>
                {voiceOptions.map((option) => (
                  <option
                    key={option.voice_id}
                    value={option.voice_id}
                    title={`Accent: ${option.labels.accent}, Description: ${option.labels.description}, Age: ${option.labels.age}, Gender: ${option.labels.gender}`}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Save Chatbot
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBot;
