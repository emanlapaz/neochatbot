import React from "react";

function Footer() {
  return (
    <div className="mt-auto p-20 bg-gradient-to-b from-transparent to-black text-white font-bold">
      <div className="flex space-x-4">
        <a
          href="https://github.com/emanlapaz/neochatbot"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 p-2 rounded"
        >
          GitHub Repo
        </a>
        <div className="bg-gray-700 p-2 rounded">Video Demo</div>
        <a
          href="https://emanlapaz.github.io/NeoLandingPage/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 p-2 rounded"
        >
          Project Page
        </a>
        <div className="bg-gray-700 p-2 rounded">PlaceHolder</div>
      </div>
    </div>
  );
}

export default Footer;
