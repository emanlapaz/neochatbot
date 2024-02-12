import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // State for the sign-up form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would integrate with your authentication service or API to create the user
    console.log("Signing up with", { username, email, password });
    // After successful signup, you might want to navigate the user to the login page or directly log them in
    navigate("/login"); // Redirect user to login page after sign-up
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:text-blue-700 font-semibold cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
