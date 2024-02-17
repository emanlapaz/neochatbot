import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Interest {
  id: number;
  name: string;
  checked: boolean;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // State for the sign-up form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [interests, setInterests] = useState<Interest[]>([
    { id: 1, name: "Technology", checked: false },
    { id: 2, name: "Music", checked: false },
    { id: 3, name: "Gaming", checked: false },
    { id: 4, name: "Sports", checked: false },
    { id: 5, name: "Travel", checked: false },
    { id: 6, name: "Books", checked: false },
    { id: 7, name: "Movies", checked: false },
    { id: 8, name: "Fitness", checked: false },
    { id: 9, name: "Fashion", checked: false },
    { id: 10, name: "Art", checked: false },
  ]);

  // Handle checkbox change
  const handleInterestChange = (id: number) => {
    setInterests(
      interests.map((interest) =>
        interest.id === id
          ? { ...interest, checked: !interest.checked }
          : interest
      )
    );
  };

  // Handle form submission
  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    // Filter selected interests
    const selectedInterests = interests
      .filter((interest) => interest.checked)
      .map((interest) => interest.name);

    // Ensure that at least one interest is selected
    if (selectedInterests.length === 0) {
      alert("Please select at least one interest.");
      return; // Stop the form submission if no interests are selected
    }

    try {
      // Make a POST request to your backend to create a new user
      const response = await fetch("http://localhost:8000/signup/", {
        // Adjust your API endpoint accordingly
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name,
          last_name,
          interests: selectedInterests, // This will not be null due to the check above
        }),
      });

      if (response.ok) {
        // Assuming the backend successfully creates a user and returns a success response
        console.log("Signup successful");
        navigate("/login"); // Redirect user to login page after successful sign-up
      } else {
        // Handle server errors or unsuccessful signup attempts
        const error = await response.json();
        console.error("Signup failed:", error.detail);
        alert("Signup failed: " + error.detail); // Displaying error in alert, consider a more user-friendly error handling
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
      alert("An error occurred during signup."); // Displaying error in alert, consider a more user-friendly error handling
    }
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
              placeholder="First Name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Last Name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
          <fieldset className="mt-4">
            <legend className="font-semibold">Interests</legend>
            <div className="grid grid-cols-2 gap-2">
              {interests.map((interest) => (
                <div key={interest.id} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`interest-${interest.id}`}
                    className="mt-1"
                    checked={interest.checked}
                    onChange={() => handleInterestChange(interest.id)}
                  />
                  <label
                    htmlFor={`interest-${interest.id}`}
                    className="ml-2 text-sm"
                  >
                    {interest.name}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

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
