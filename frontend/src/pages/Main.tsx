import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbox from "../components/Chatbox";
import PresetGpt from "../components/PresetGpt";
import CustomBox from "../components/CustomBox";

function Main() {
  return (
    <div className="flex flex-col min-h-screen border-2 border-gray-300 rounded-lg p-4">
      <Header />
      <div className="flex-1 flex items-start justify-between p-4 space-x-4">
        {/* Left side column for PresetGpt and CustomBox */}
        <div className="flex flex-col w-1/3 space-y-4">
          {/* PresetGpt box */}
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-100">
            <PresetGpt />
          </div>
          {/* CustomBox placed below PresetGpt */}
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-100">
            <CustomBox />
          </div>
        </div>
        {/* Chatbox remains on the right, maintaining its size */}
        <div className="w-1/3 border-2 border-gray-300 rounded-lg p-4 bg-gray-800">
          <Chatbox />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
