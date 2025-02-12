import React from "react";
import Header from "./Componants/Header";
import About from "./Componants/About";

const Semester = [
  { name: " Sem - 1" },
  { name: " Sem - 2" },
  { name: " Sem - 3" },
  { name: " Sem - 4" },
  { name: " Sem - 5" },
  { name: " Sem - 6" }
 
];

const App = () => {
  return (
    <div className=" w-full h-screen bg-black text-white flex flex-col items-center justify-center  px-6">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <main className="text-center mt-10 w-full ">
        <h2 className="text-4xl font-bold">Welcome to GRAD-PATH</h2>
        <p className="mt-2 text-gray-400">
          Your one-stop platform for sharing and accessing subject Notes and PYQ 
        </p>

        {/* About Section */}
        <About/>

        {/* Branches Section */}
        <h3 className="text-2xl font-semibold mt-12">BCA Semester</h3>
        <div className="mt-6 flex items-center justify-center flex-wrap gap-6">
          {Semester.map((Semester, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
            >
              <h4 className="font-bold text-lg">{Semester.name}</h4>
              <button className="mt-4 px-8 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition">
                Explore 
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
