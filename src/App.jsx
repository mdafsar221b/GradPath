import React from "react";
import Header from "./Componants/Header";
import About from "./Componants/About";
import SemesterSection from "./Componants/Semester";



const App = () => {
  return (
    <div className=" w-full h-full bg-black text-white flex flex-col items-center justify-center px-6 pb-6 ">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <main className="text-center mt-10 w-full h-full ">
        <h2 className="text-4xl font-bold">Welcome to GRAD-PATH</h2>
        <p className="mt-2 text-gray-400">
          Your one-stop platform for sharing and accessing subject Notes and PYQ 
        </p>

        {/* About Section */}
        <About/>

        {/* Branches Section */}
         <SemesterSection/>
      </main>
    </div>
  );
};

export default App;
