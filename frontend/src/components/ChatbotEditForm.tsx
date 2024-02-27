import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

interface Chatbot {
  id: string;
  bot_name: string;
  scene: string;
  personality: string;
  language: string;
  specialization: string;
  voice_enabled: boolean;
  voice_name?: string;
}

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
  const [scene, setScene] = useState(chatbot.scene);
  const [personality, setPersonality] = useState(chatbot.personality);
  const [language, setLanguage] = useState(chatbot.language);
  const [specialization, setSpecialization] = useState(chatbot.specialization);
  const [voiceEnabled, setVoiceEnabled] = useState(
    chatbot.voice_enabled ?? false
  );

  const [voiceName, setVoiceName] = useState(chatbot.voice_name);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "voice_enabled") {
      // Specifically check if the event target is an input element and its type is checkbox
      const target = e.target as HTMLInputElement; // Cast to HTMLInputElement to access 'checked'
      setVoiceEnabled(target.checked);
    } else {
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
        case "voice_name":
          setVoiceName(value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...chatbot,
      scene,
      personality,
      language,
      specialization,
      voice_enabled: voiceEnabled,
      // Set voice_name to null or an empty string if voiceEnabled is false
      voice_name: voiceEnabled ? voiceName : "",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Configuring {chatbot.bot_name}{" "}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        {/* Scene Input */}
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

        {/* Personality Select */}
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

        {/* Language Select */}
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

        {/* Specialization Input */}
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

        {/* Voice Enabled Select */}
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

        {/* Conditional Voice Name Select */}
        {voiceEnabled && (
          <label>
            Voice Name:
            <select
              className="bg-gray-300 p-2 rounded text-gray-800 mt-1 block w-full"
              name="voice_name"
              value={voiceName || ""}
              onChange={handleChange}
            >
              <option value="">Select a Voice</option>
              <option value="James">James</option>
              <option value="Mary">Mary</option>
              {/* Add more voice name options as needed */}
            </select>
          </label>
        )}

        <div className="flex justify-center space-x-2 mt-4">
          {/* Save Button */}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
          </button>

          {/* Cancel Button */}
          <button
            type="button" // Ensure this is 'button' to prevent form submission
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={onCancel} // Call the onCancel function when clicked
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotEditForm;
