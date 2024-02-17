import { useState } from "react";
import axios from "axios";

type Props = {
  setMessages: any;
};

function Title({ setMessages }: Props) {
  const [isResetting, setIsResetting] = useState(false);

  //Reset the conversation
  const resetConversation = async () => {
    setIsResetting(true);

    //reset end point on backend
    await axios
      .get("http://localhost:8000/reset")
      .then((res) => {
        if (res.status == 200) {
          setMessages([]); //set messages to empty list when successful
        } else {
          console.error("Error on API request backend reset");
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
    setIsResetting(false);
  };

  //add reset button on title
  return (
    <div className="flex justify-between items-center w-full p-2 bg-blue-900 text-white font-bold drop-shadow">
      <div className="font-bold">NEOChatBot -Title</div>
      <button
        onClick={resetConversation} //changes color when mouse hovered icon from heroicons
        className={
          "transition-all duration-300 text-blue-300 hover:text-yellow-300 " +
          (isResetting && "animate-pulse")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
    </div>
  );
}

export default Title;
