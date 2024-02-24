import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onValue, getDatabase } from "firebase/database";

function PresetGpt() {
  const [interests, setInterests] = useState<string[]>([]);
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

  const handleButtonClick = (interest: string, buttonIndex: number) => {
    setActiveButtons((prevActiveButtons) => {
      // Create a copy of the previous active buttons
      const newActiveButtons = { ...prevActiveButtons };

      // Set the clicked button as active
      newActiveButtons[interest] =
        buttonIndex === newActiveButtons[interest] ? 0 : buttonIndex;

      // Reset other buttons within the same interest group
      Object.keys(newActiveButtons).forEach((key) => {
        if (key !== interest) {
          newActiveButtons[key] = 0;
        }
      });

      return newActiveButtons;
    });
  };

  // Function to generate button labels based on interest
  const getButtonLabel = (interest: string, buttonIndex: number) => {
    if (interest === "Technology") {
      const techLabels = ["AI", "Blockchain", "Cloud", "IoT"];
      return techLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else if (interest === "Music") {
      const musicLabels = ["TuneTalk", "BeatBot", "MeloMate", "RhythmiChat"];
      return musicLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else if (interest === "Gaming") {
      const gamingLabels = ["GameGuru", "PlayPal", "QuestBot", "Consoler"];
      return gamingLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else if (interest === "Sports") {
      const sportsLabels = [
        "SportyMate",
        "FanFrenzy",
        "AthleteAlly",
        "FitnessFan",
      ];
      return sportsLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else if (interest === "Travel") {
      const travelLabels = [
        "TravelMate",
        "ExploreBot",
        "JourneyJolt",
        "WanderWhiz",
      ];
      return travelLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else if (interest === "Books") {
      const booksLabels = ["BookWorm", "LitLover", "StorySeeker", "PageTurner"];
      return booksLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else if (interest === "Movies") {
      const moviesLabels = [
        "CineChat",
        "FilmFriend",
        "ScreenSavvy",
        "MovieMania",
      ];
      return moviesLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else if (interest === "Fitness") {
      const fitnessLabels = [
        "FitFriend",
        "HealthHero",
        "WorkoutWizard",
        "XerciseExpert",
      ];
      return fitnessLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else if (interest === "Fashion") {
      const fashionLabels = [
        "StyleSavvy",
        "TrendTalk",
        "Fashionista",
        "ChicChat",
      ];
      return fashionLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else if (interest === "Art") {
      const artLabels = [
        "ArtAficionado",
        "CreativeCom",
        "PalettePal",
        "VisualVirto",
      ];
      return artLabels[buttonIndex - 1] || `Button ${buttonIndex}`;
    } else {
      return `Button ${buttonIndex}`;
    }
  };

  // Inline style for buttons to ensure uniform size
  const buttonStyle = {
    width: "90px", // Fixed width for all buttons
    padding: "5px 0", // Consistent padding
  };

  return (
    <div className="flex justify-center items-center">
      <div>
        <h2 className="text-xl font-bold mb-4">Recommended GPTs</h2>
        <div
          className="p-4 bg-gray-100 rounded-lg shadow"
          style={{ maxWidth: "500px" }}
        >
          <div className="flex flex-col space-y-2">
            {interests.length > 0 ? (
              interests.map((interest, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-32 h-10 bg-gray-300 p-2 rounded text-gray-800 flex items-center justify-center">
                    {interest}
                  </div>
                  {[1, 2, 3, 4].map((buttonIndex) => (
                    <button
                      key={buttonIndex}
                      style={buttonStyle}
                      className={`rounded text-white text-sm ${
                        activeButtons[interest] === buttonIndex
                          ? "bg-purple-500"
                          : "bg-blue-500 hover:bg-blue-700"
                      }`}
                      onClick={() => handleButtonClick(interest, buttonIndex)}
                    >
                      {getButtonLabel(interest, buttonIndex)}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-300 p-2 rounded text-gray-800 h-10 flex items-center justify-center">
                  No interests found
                </div>
                {[1, 2, 3, 4].map((buttonIndex) => (
                  <button
                    key={buttonIndex}
                    style={buttonStyle}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
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
