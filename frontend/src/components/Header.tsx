import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMain = () => {
    navigate("/main");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAbout = () => {
    navigate("/about");
  };

  const handleAccountSettings = () => {
    navigate("/account-settings");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex justify-between items-center w-full p-6 text-black [font-family:'Maven_Pro-Bold',Helvetica] drop-shadow">
      <div>Neo ChatBOt</div>
      <div className="flex justify-between items-center space-x-4">
        <div
          className={`bg-gray-200 p-2 rounded cursor-pointer ${
            isActive("/main") ? "bg-gray-400" : ""
          }`}
          onClick={handleMain}
        >
          Main Page
        </div>
        <div
          className={`bg-gray-200 p-2 rounded cursor-pointer ${
            isActive("/account-settings") ? "bg-gray-400" : ""
          }`}
          onClick={handleAccountSettings}
        >
          Account Settings
        </div>
        <div
          className={`bg-gray-200 p-2 rounded cursor-pointer ${
            isActive("/about") ? "bg-gray-400" : ""
          }`}
          onClick={handleAbout}
        >
          About Neo
        </div>
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
