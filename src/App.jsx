import React from "react";
import { useAnimateLinks } from './hooks/useAnimateLinks';
import Semester1 from "./Componants/Semester1";
import Semester2 from "./Componants/Semester2";
import Semester3 from "./Componants/Semester3";
import Semester4 from "./Componants/Semester4";
import Semester5 from "./Componants/Semester5";
import Semester6 from "./Componants/Semester6";
import Header from "./Componants/Header";
import About from "./Componants/About";

const App = () => {
  useAnimateLinks();
  

  return (
    <div className="  w-full h-full bg-white text-black flex flex-col items-center justify-center px-6 pb-6">
      <Header/>
      <About/>
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
