import { useState } from "react";
import Title from "./ChatBoxTitle";
import RecordChat from "./RecordChat";
import axios from "axios";

function Chatbox() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const createBlobUrl = (data: any) => {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  };

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);

    //add recorded message to messages
    const userMessage = { sender: "user", blobUrl };
    const messagesArray = [...messages, userMessage];

    //convert blob url to blob object
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        //contruct audio to send file
        const formData = new FormData();
        formData.append("file", blob, "userFile.wav");

        //send formed data to api endpoint
        await axios
          .post("http://localhost:8000/post-audio", formData, {
            headers: { "Content-Type": "audio/mpeg" },
            responseType: "arraybuffer",
          })
          .then((res: any) => {
            const blob = res.data;
            const audio = new Audio();
            audio.src = createBlobUrl(blob);

            //add to audio
            const neoMessage = { sender: "neo", blobUrl: audio.src };
            messagesArray.push(neoMessage);
            setMessages(messagesArray);

            //play audio
            setIsLoading(false);
            audio.play();
          })
          .catch((err) => {
            console.error(err.message);
            setIsLoading(false);
          });
      });

    setIsLoading(false);
  };

  return (
    <div className="h-screen overflow-y-hidden">
      <Title setMessages={setMessages} />
      <div className="flex flex-col justify-between h-5/6 overflow-y-scroll bg-black text-white">
        <div className="w-full mt-5 p-2 px-5">
          {" "}
          {/* Chat: loop and iterates the messages */}
          {messages.map((audio, index) => {
            return (
              <div
                key={index + audio.sender}
                className={
                  "flex flex-col " + (audio.sender == "neo" && "flex items-end")
                }
              >
                {/* Sender */}
                <div className="mt-4">
                  <p
                    className={
                      audio.sender == "neo"
                        ? "text-right mr-2 italic text-green-500"
                        : "ml-2 italic text-blue-500"
                    }
                  >
                    {audio.sender}
                  </p>

                  {/* Audio message */}
                  <audio
                    src={audio.blobUrl}
                    className="appearance-none"
                    controls
                  />
                </div>
              </div>
            );
          })}
          {messages.length == 0 && !isLoading && (
            <div className="text-center font-light italic mt-10">
              Press the microphone to talk or Type to Chat
            </div>
          )}
          {isLoading && (
            <div className="text-center font-light italic mt-10 animate-pulse">
              Please wait...
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex-grow pr-10 py-4">
          <label htmlFor="textInput" className="block text-white">
            Chat here:
          </label>
          <input
            type="text"
            id="textInput"
            className="w-full border border-gray-400 rounded-lg px-3 py-4 mt-1 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter text here..."
          />
        </div>
        <div className="pt-4 pr-8">
          <RecordChat handleStop={handleStop} />
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
