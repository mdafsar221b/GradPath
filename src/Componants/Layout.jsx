import { Outlet, NavLink } from "react-router-dom";
import React, { useState } from "react";
import Header from "./Header";
import About from "./About";
import HeaderYT from "./HeaderYT";
import YoutubeResources from "./YoutubeResources";
import Footer from "./Footer/Footer";
import GeminiCard from "./GeminiCard";

const Layout = () => {
  const [showGeminiCard, setShowGeminiCard] = useState(false);

  const toggleGeminiCard = () => {
    setShowGeminiCard((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col mb-6">
      {/* Pass toggle function to Header */}
      <Header toggleGeminiCard={toggleGeminiCard} />
     <button onClick={toggleGeminiCard}>Chat</button>

      <div className="max-w-4xl mt-4 mx-auto p-4 sm:p-8 flex items-center justify-center flex-col">
        <About />
        {showGeminiCard ? <GeminiCard /> : 
        <nav className="semester-nav">
          {Array.from({ length: 6 }, (_, i) => (
            <NavLink
              key={i + 1}
              to={`/semester/${i + 1}`}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Semester {i + 1}
            </NavLink>
          ))}
        </nav> }

        <main>
          <Outlet />
        </main>
        <HeaderYT />
      </div>

      <div className="flex items-center justify-center gap-2 mt-1 sm:mt-2 flex-col">
        <div className="flex justify-center items-center">
          <YoutubeResources />
        </div>
        {/* Show GeminiCard when toggled */}
       
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
