import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbox from "../components/Chatbox";

function Main() {
  return (
    <div className="flex flex-col min-h-screen border-2 border-gray-300 rounded-lg p-4">
      <Header />
      <div className="flex flex-1 items-center justify-end p-4">
        {/* Adjust padding as necessary */}
        <div className="w-1/3 h-1/2 border-2 border-gray-300 rounded-lg p-4 bg-gray-800">
          <Chatbox />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
