import React from "react";
import Semester1 from "./Componants/Semester1";
import Semester2 from "./Componants/Semester2";
import Semester3 from "./Componants/Semester3";
import Semester4 from "./Componants/Semester4";
import Semester5 from "./Componants/Semester5";
import Semester6 from "./Componants/Semester6";
import Header from "./Componants/Header";
import { useState } from "react";

const App = () => {
  // State to track active state of each button
  const [activeButtons, setActiveButtons] = useState([false, false, false]);

  // Handler function for button clicks
  const handleClick = (index) => {
    setActiveButtons(prevState => {
      // Create a copy of previous state to avoid direct mutation
      const newState = [...prevState];
      // Toggle the state for the clicked button
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="  w-full h-full bg-black text-white flex flex-col items-center justify-center px-6 pb-6">
      <Header/>
      <div className="flex gap-14 p-6 flex-wrap items-center justify-center w-full h-full">
      <Semester1/>
      <Semester2/>
      <Semester3/>
      <Semester4/>
      <Semester5/>
      <Semester6/>

      </div>
    </div>
  );
};

export default App;
