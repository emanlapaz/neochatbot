import { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useChatbot } from "./ChatbotContext";

type Props = {
  setMessages: any;
};

function Title({ setMessages }: Props) {
  const [isResetting, setIsResetting] = useState(false);
  const [botName, setBotName] = useState("Loading bot...");
  const { chatbotId } = useChatbot();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((idToken) => {
          const config = {
            headers: { Authorization: `Bearer ${idToken}` },
          };

          axios
            .get(
              `https://neochatbot-2.onrender.com/get-bot-name/${chatbotId}`,
              config
            )
            .then((res) => {
              if (res.status === 200 && res.data.bot_name) {
                setBotName(res.data.bot_name);
              }
            })
            .catch((err) => {
              console.error(err.message);
              setBotName("Bot name load error");
            });
        });
      }
    });
  }, [chatbotId]);

  const resetConversation = async () => {
    setIsResetting(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (user && chatbotId) {
      try {
        const idToken = await user.getIdToken();
        const config = {
          headers: { Authorization: `Bearer ${idToken}` },
        };

        const response = await axios.get(
          `https://neochatbot-2.onrender.com/reset?chatbot_id=${chatbotId}`,
          config
        );
        if (response.status === 200) {
          setMessages({ userMessages: [], assistantMessages: [] });
        } else {
          console.error("Error on API request backend reset");
        }
      } catch (error: any) {
        console.error(error.response?.data?.detail || error.message);
      }
    } else {
      console.error("No user is signed in or chatbotId is missing.");
    }

    setIsResetting(false);
  };

  return (
    <div className="flex justify-between items-center w-full p-2 bg-blue-900 text-white font-bold drop-shadow">
      <div className="font-bold">{botName}</div>
      <button
        onClick={resetConversation}
        className={
          "transition-all duration-300 text-blue-300 hover:text-yellow-300 " +
          (isResetting && "animate-pulse")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
    </div>
  );
}

export default Title;
