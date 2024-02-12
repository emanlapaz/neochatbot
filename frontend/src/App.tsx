// App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import LoginPage from "./pages/LogIn";
import About from "./pages/About"; // Ensure this is imported if you're using it
import AccountSetting from "./pages/AccountSetting"; // Import the AccountSetting component
import SignUp from "./pages/SignUp"; // Import the SignUp component

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/about" element={<About />} />
        <Route path="/account-settings" element={<AccountSetting />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
