import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate to the main page
  const handleMain = () => {
    navigate("/main");
  };

  // Navigate to the login page for logout
  const handleLogout = () => {
    navigate("/login");
  };

  // Navigate to the about page
  const handleAbout = () => {
    navigate("/about");
  };

  // Navigate to the account settings page
  const handleAccountSettings = () => {
    navigate("/account-settings");
  };

  // Check if the current path matches the given path
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex justify-between items-center w-full p-6 text-black [font-family:'Maven_Pro-Bold',Helvetica] drop-shadow">
      <div>Neo ChatBOt</div>
      <div className="flex justify-between items-center space-x-4">
        {/* Main Page Link */}
        <div
          className={`bg-gray-200 p-2 rounded cursor-pointer ${
            isActive("/main") ? "bg-gray-400" : ""
          }`}
          onClick={handleMain}
        >
          Main Page
        </div>
        {/* Account Settings Link */}
        <div
          className={`bg-gray-200 p-2 rounded cursor-pointer ${
            isActive("/account-settings") ? "bg-gray-400" : ""
          }`}
          onClick={handleAccountSettings}
        >
          Account Settings
        </div>
        {/* About Page Link */}
        <div
          className={`bg-gray-200 p-2 rounded cursor-pointer ${
            isActive("/about") ? "bg-gray-400" : ""
          }`}
          onClick={handleAbout}
        >
          About Neo
        </div>
        {/* Logout Link */}
        <div
          className="bg-gray-200 p-2 rounded cursor-pointer"
          onClick={handleLogout}
        >
          Log Out
        </div>
      </div>
    </div>
  );
}

export default Header;
