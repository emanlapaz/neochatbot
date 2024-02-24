import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

function ChatBotList() {
  const [openChatbotId, setOpenChatbotId] = useState<number | null>(null); // State to track the currently open chatbot's id for details
  const [openPlaceholderId, setOpenPlaceholderId] = useState<number | null>(
    null
  ); // State to track the currently open chatbot's id for placeholders

  const chatbots = [
    { id: 1, name: "Neo" },
    { id: 2, name: "Chatbot 2" },
    { id: 3, name: "Chatbot 3" },
  ];

  // Function to toggle the open state of the chatbot's placeholders
  const togglePlaceholder = (chatbotId: number) => {
    // Ensure that opening a placeholder closes any open details
    setOpenChatbotId(null);
    setOpenPlaceholderId(openPlaceholderId === chatbotId ? null : chatbotId);
  };

  // Function to toggle the open state of the chatbot's details
  const toggleChatbotDetails = (chatbotId: number) => {
    // Ensure that opening details closes any open placeholders
    setOpenPlaceholderId(null);
    setOpenChatbotId(openChatbotId === chatbotId ? null : chatbotId);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ChatBot List</h2>
      <div className="grid grid-cols-1 gap-4">
        {chatbots.map((chatbot) => (
          <div key={chatbot.id} className="bg-white border rounded relative">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                {/* Make the chatbot name a clickable button for placeholders */}
                <button
                  onClick={() => togglePlaceholder(chatbot.id)}
                  className="text-left focus:outline-none"
                >
                  {chatbot.name}
                </button>
              </div>
              <button
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents togglePlaceholder when clicking the ellipsis
                  toggleChatbotDetails(chatbot.id);
                }}
              >
                <FontAwesomeIcon icon={faEllipsisH} />
              </button>
            </div>
            {openPlaceholderId === chatbot.id && (
              <div className="p-4 border-t">
                <p>
                  <strong>Chat History:</strong>
                </p>
                {/* Placeholder content here */}
                <p>Chat 1</p>
                <p>Chat 2</p>
                <p>Chat 3</p>
              </div>
            )}
            {openChatbotId === chatbot.id && (
              <div className="p-4 border-t">
                <p>
                  <strong>Details:</strong>
                </p>
                <p>Scene: </p>
                <p>Personality: </p>
                <p>Language: </p>
                <p>Specialization: </p>
                <p>Voice Enabled: No</p>
                <p>Voice Name: </p>
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
