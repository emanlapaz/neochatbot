import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbox from "../components/Chatbox";
import PresetGpt from "../components/PresetGpt";
import CustomBox from "../components/CreateBot";
import Welcome from "../components/Welcome";
import ChatBotList from "../components/ChatBotList";
import RecordChat from "../components/RecordChat";
import { ChatbotProvider } from "../components/ChatbotContext";

function Main() {
  return (
    <ChatbotProvider>
      <div className="flex flex-col min-h-screen border-2 border-gray-300 rounded-lg">
        <Header />
        <div className="pt-4 p-4 flex-1">
          <div className="mb-8">
            <Welcome />
          </div>
          <div className="flex items-start justify-between space-x-4">
            <div className="flex flex-col w-1/3 space-y-4">
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-100">
                <PresetGpt />
              </div>
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-100">
                <CustomBox />
              </div>
            </div>

            <div className="w-1/3 border-2 border-gray-300 rounded-lg p-4 bg-gray-100">
              <ChatBotList />
            </div>
            <div className="w-2/3 border-2 border-gray-300 rounded-lg p-4 bg-gray-800">
              <Chatbox />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ChatbotProvider>
  );
}

export default Main;
