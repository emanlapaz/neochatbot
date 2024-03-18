import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCKjPPw2ARuL8GwpVUGKTjsmvsMcJr_DLk",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "neo-chatbot-e6c8c",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://neo-chatbot-e6c8c-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth service
const auth = getAuth(app);

// Get a reference to the database service
const database = getDatabase(app);

export { auth, database };
