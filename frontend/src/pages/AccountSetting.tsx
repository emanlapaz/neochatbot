import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const AccountSetting: React.FC = () => {
  const navigate = useNavigate();

  // State for form fields (example: username and email)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleUpdate = () => {
    // Here you would add logic to update user settings
    console.log("Updating account settings...", { username, email });
    // Optionally navigate to another page on successful update
    // navigate("/main");
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md">
          <form className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
            {/* Username Input */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>

            {/* Update Button */}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleUpdate}
              >
                Update Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountSetting;
