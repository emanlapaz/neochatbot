import { useState } from "react";
import axios from "axios";
import Title from "./ChatBoxTitle";

function Chatbox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ sender: "", content: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    setIsLoading(true);
    const userMessage = { sender: "user", content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post(
        "http://localhost:8000/post-text/",
        JSON.stringify({ text: message }), // Ensure the payload is correctly structured
        {
          headers: {
            "Content-Type": "application/json", // Set the Content-Type header
          },
        }
      );
      const botResponse = {
        sender: "bot",
        content: response.data.bot_response,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setMessage(""); // Clear the input after sending
    setIsLoading(false);
  };

  return (
    <div className="h-screen overflow-y-hidden bg-black">
      <Title setMessages={setMessages} />
      <div className="flex flex-col justify-between h-5/6 overflow-y-scroll p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`message-content ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              } rounded-lg inline-block p-2 m-1`}
            >
              {msg.content}
            </p>
          </div>
        ))}
        {isLoading && (
          <p className="text-center  text-white">Waiting for reply...</p>
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
