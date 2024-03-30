import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { getVoiceOptions } from "./VoiceOptionsData";

//defines types and interfaces
interface Chatbot {
  id: string;
  bot_name: string;
  scene: string;
  personality: string;
  language: string;
  specialization: string;
  voice_enabled: boolean;
  voice_name?: string;
  voice_id?: string;
}

//define props
interface ChatbotEditFormProps {
  chatbot: Chatbot;
  onSave: (chatbot: Chatbot) => void;
  onCancel: () => void;
}

const ChatbotEditForm: React.FC<ChatbotEditFormProps> = ({
  chatbot,
  onSave,
  onCancel,
}) => {
  //defines state variables using useState hook
  const [scene, setScene] = useState(chatbot.scene);
  const [personality, setPersonality] = useState(chatbot.personality);
  const [language, setLanguage] = useState(chatbot.language);
  const [specialization, setSpecialization] = useState(chatbot.specialization);
  const [voiceEnabled, setVoiceEnabled] = useState(
    chatbot.voice_enabled ?? false
  );
  const [voiceId, setVoiceId] = useState(chatbot.voice_id);

  //voice options array
  const voiceOptions = getVoiceOptions();

  //handles changes in input
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    //Toggle voiceEnabled state
    if (name === "voice_enabled") {
      setVoiceEnabled(!voiceEnabled);
    } else if (name === "voice_id") {
      //set voice id state
      setVoiceId(value);
    } else {
      //sets appropriate state based on input name
      switch (name) {
        case "scene":
          setScene(value);
          break;
        case "personality":
          setPersonality(value);
          break;
        case "language":
          setLanguage(value);
          break;
        case "specialization":
          setSpecialization(value);
          break;
      }
    }
  };

  //handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //creates an updated chatbot with new value
    const updatedChatbot = {
      ...chatbot,
      scene,
      personality,
      language,
      specialization,
      voice_enabled: voiceEnabled,
    };

    //update voice properties to toggle voices functionality on/off
    if (voiceEnabled) {
      const voiceOption = voiceOptions.find(
        (option) => option.voice_id === voiceId
      );
      updatedChatbot.voice_id = voiceId;
      updatedChatbot.voice_name = voiceOption
        ? voiceOption.name
        : "voiceDisabled";
    } else {
      updatedChatbot.voice_id = "voiceDisabled";
      updatedChatbot.voice_name = "voiceDisabled";
    }

    //save chtbot
    onSave(updatedChatbot);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Configuring {chatbot.bot_name}{" "}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <label
            htmlFor="scene"
            className="block text-sm font-medium text-gray-700"
          >
            Scene
          </label>
          <input
            type="text"
            name="scene"
            value={scene}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Scene"
          />
        </div>

        <label>
          Personality:
          <select
            className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
            name="personality"
            value={personality}
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
            value={language}
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
            value={specialization}
            onChange={handleChange}
          />
        </label>

        <label>
          Enable Voice:
          <select
            className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
            name="voice_enabled"
            value={voiceEnabled ? "Yes" : "No"}
            onChange={handleChange}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>

        {voiceEnabled && (
          <label>
            Voice Name:
            <select
              className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
              name="voice_id"
              value={voiceId || ""}
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
        <div className="flex justify-center space-x-2 mt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
          </button>
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default ChatbotEditForm;
