import React from "react";

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
    <div className=" w-full bg-black text-white flex flex-col items-center justify-center  px-6">
      {/* Header */}
      <header className="w-full py-6">
        <h1 className="text-3xl font-bold">GRAD-PATH</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 ">
        <h2 className="text-4xl font-bold">Welcome to GRAD-PATH</h2>
        <p className="mt-2 text-gray-400">
          Your one-stop platform for sharing and accessing subject Notes and PYQ 
        </p>

        {/* About Section */}
        <div className="mt-10 bg-gray-900 p-6 rounded-lg w-full max-w-3xl shadow-lg">
          <h3 className="text-xl font-semibold">About GradPath</h3>
          <p className="text-gray-400 mt-2">
            Empowering students with knowledge sharing
          </p>
          <p className="mt-4 text-gray-300">
            GradPath is a comprehensive note-sharing platform designed to help students access and share academic resources across various engineering branches and semesters. With a wide range of subjects and an easy-to-navigate interface, we aim to make learning collaborative and efficient.
          </p>
        </div>

        {/* Branches Section */}
        <h3 className="text-2xl font-semibold mt-12">BCA Semester</h3>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Semester.map((Semester, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
            >
              <h4 className="font-bold text-lg">{Semester.name}</h4>
              <button className="mt-4 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition">
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
