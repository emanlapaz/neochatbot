import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onValue, getDatabase } from "firebase/database";

function PresetGpt() {
  const [interests, setInterests] = useState<string[]>([]);
  // State to track the active button for each interest
  const [activeButtons, setActiveButtons] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const auth = getAuth();
    const database = getDatabase();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const interestsRef = ref(database, `users/${user.uid}/interests`);
        onValue(interestsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setInterests(data);
          } else {
            setInterests([]);
          }
        });
      } else {
        console.log("User not signed in or user data not available");
      }
    });
  }, []);

  // Handler to update the active button state
  const handleButtonClick = (interest: string, buttonIndex: number) => {
    setActiveButtons((prevActiveButtons) => ({
      ...prevActiveButtons,
      [interest]: buttonIndex,
    }));
  };

  return (
    <div className="flex justify-center items-center">
      <div>
        Recommended GPTs
        <div
          className="p-4 bg-gray-100 rounded-lg shadow"
          style={{ maxWidth: "500px" }}
        >
          <div className="flex flex-col space-y-2">
            {interests.length > 0 ? (
              interests.map((interest, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-300 p-2 rounded text-gray-800">
                    {interest}
                  </div>
                  {[1, 2, 3, 4].map((buttonIndex) => (
                    <button
                      key={buttonIndex}
                      className={`py-1 px-2 rounded text-white font-bold ${
                        activeButtons[interest] === buttonIndex
                          ? "bg-purple-500" // Highlighted style
                          : "bg-blue-500 hover:bg-blue-700"
                      }`}
                      onClick={() => handleButtonClick(interest, buttonIndex)}
                    >
                      Button {buttonIndex}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-300 p-2 rounded text-gray-800">
                  No interests found
                </div>
                {[1, 2, 3, 4].map((buttonIndex) => (
                  <button
                    key={buttonIndex}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Button {buttonIndex}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresetGpt;
