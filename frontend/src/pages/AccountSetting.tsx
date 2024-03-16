import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  getAuth,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { ref, onValue, update, getDatabase } from "firebase/database";
import { sendEmailVerification } from "firebase/auth";

interface UserState {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  emailVerified: boolean;
}

const AccountSetting: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const database = getDatabase();

  const [userDetails, setUserDetails] = useState<UserState>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    emailVerified: false,
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserDetails((prevState) => ({
              ...prevState,
              username: data.username || "",
              email: user.email || "",
              first_name: data.first_name || "",
              last_name: data.last_name || "",
              emailVerified: user.emailVerified || false,
            }));
          }
        });
      } else {
        navigate("/login");
      }
    });
  }, [auth, database, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Name:", name);
    console.log("Value:", value);
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      try {
        await update(ref(database, `users/${user.uid}`), {
          username: userDetails.username,
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
        });

        if (user.email !== userDetails.email) {
          if (!userDetails.emailVerified) {
            await sendEmailVerification(user);
            alert(
              "A verification email has been sent to your new email address. Please verify your email before proceeding."
            );
          } else {
            await updateEmail(user, userDetails.email);
          }
        }

        if (userDetails.password) {
          await updatePassword(user, userDetails.password);
        }

        alert("User details updated successfully!");
      } catch (error) {
        console.error("An error occurred: ", error);
        alert(
          "An error occurred. You may need to re-authenticate or check your input."
        );
      }
    } else {
      alert("No authenticated user found.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-wrap -mx-3">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
              <h3 className="block text-gray-700 text-lg font-bold mb-4">
                Current User Details
              </h3>
              <p>
                <strong>Username:</strong> {userDetails.username}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>First Name:</strong> {userDetails.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {userDetails.last_name}
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 px-3">
            <form
              onSubmit={handleUpdate}
              className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4"
            >
              <h3 className="block text-gray-700 text-lg font-bold mb-4">
                Update User Details
              </h3>
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
                  name="username"
                  value={userDetails.username}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="first_name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={userDetails.first_name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="last_name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={userDetails.last_name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Change Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userDetails.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSetting;
