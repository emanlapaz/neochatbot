import React from "react";
import Header from "../components/Header";

export const About: React.FC = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <div className="max-w-4xl p-5 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          About NEO ChatBot Creator
        </h1>

        <p className="mb-4 text-white">
          NEO ChatBot is a web-based AI chatbot creation platform designed for
          ease of use and flexibility. It enables users to build, fine-tune, and
          deploy chatbots tailored for various applications, from customer
          service to interactive engagements.
        </p>

        <p className="mb-4 text-white">
          Our mission is to simplify AI technology, making it accessible for
          businesses and individuals to create intelligent conversational agents
          without the need for extensive programming knowledge.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-2">Team</h2>
        <p className="text-white">
          The NEO ChatBot Creator team is composed of dedicated professionals in
          AI, software development, and UX/UI design, committed to providing an
          intuitive and powerful platform for our users.
        </p>

        <img
          className="mt-1 mx-auto object-cover rounded-lg shadow-md"
          src="neo_icon.png"
          alt="Our Team"
          style={{ maxWidth: "90%", height: "auto" }}
        />

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-2">Contact Us</h3>
          <p className="text-white">
            If you have any questions or feedback, feel free to reach out.
          </p>
          <p className="mt-2 text-white">Email: support@neochatbot.com</p>
        </div>
      </div>
    </div>
  );
};

export default About;
