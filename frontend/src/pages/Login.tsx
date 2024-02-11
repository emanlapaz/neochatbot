import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Performing login with", { username, password });
    navigate("/main");
  };

  const handleSignUp = () => {
    navigate("/signup"); // Adjust the route as necessary
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-full max-w-6xl mx-auto">
        {/* About Section */}
        <div className="flex-1 max-w-4xl p-5 text-center mr-8">
          {" "}
          {/* Added right margin */}
          <h1 className="text-4xl font-bold text-white mb-4">
            NEO ChatBot Creator
          </h1>
          <p className="mb-4 text-white">
            NEO ChatBot is a web-based AI chatbot creation platform designed for
            ease of use and flexibility. It enables users to build, fine-tune,
            and deploy chatbots tailored for various applications, from customer
            service to interactive engagements.
          </p>
          <p className="mb-4 text-white">
            Our mission is to democratize AI technology, making it accessible
            for businesses and individuals to create intelligent conversational
            agents without the need for extensive programming knowledge.
          </p>
          <img
            className="mt-1 mx-auto object-cover rounded-lg shadow-md"
            src="neo_icon.png"
            alt="Our Team"
            style={{ maxWidth: "90%", height: "auto" }}
          />
        </div>

        {/* Login Form */}
        <div className="flex-1 p-8 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-4">
            Login to NEO ChatBot Creator
          </h1>
          <form onSubmit={handleLogin}>
            {/* Inputs and Submit Button */}
            <form onSubmit={handleLogin}>
              {/* Username Input */}
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              {/* Password Input */}
              <div className="mb-6">
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* Submit Button */}
            </form>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
          </form>
          {/* Sign Up Link */}
          <p className="mt-4 text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={handleSignUp}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
