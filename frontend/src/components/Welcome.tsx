import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Welcome: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email);
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-2 bg-blue-100 rounded-lg shadow-md text-blue-800 font-medium text-lg">
      Hello {userName || "User"}
    </div>
  );
};

export default Welcome;
