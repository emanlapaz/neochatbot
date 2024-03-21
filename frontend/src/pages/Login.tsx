import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/main");
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Login failed: ", errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-full max-w-6xl mx-auto">
        <div className="flex-1 max-w-4xl p-5 text-center mr-8">
          {" "}
          <h1 className="text-4xl font-bold text-white mb-4">
            NEO ChatBot Creator
          </h1>
          <img
            className="mt-1 mx-auto object-cover rounded-lg shadow-md"
            src="neo_icon.png"
            alt="Our Team"
            style={{ maxWidth: "90%", height: "auto" }}
          />
          <p className="mb-4 text-white">
            NEO ChatBot is a web-based AI chatbot creation platform designed for
            ease of use and flexibility. It enables users to create and
            customize chatbots for various applications using interactive text
            and voice conversations.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-auto p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-4xl font-bold mb-4">
              Login to NEO ChatBot Creator
            </h1>

            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="mb-4">
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Log In
              </button>
            </form>
            <p className="mt-4 text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={handleSignUp}
                className="text-blue-500 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
