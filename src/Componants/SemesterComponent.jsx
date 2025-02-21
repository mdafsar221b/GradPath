import React, { useContext } from "react";
import { useLoaderData } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";

const SemesterComponent = () => {
  const semesterData = useLoaderData();
  const { isDark } = useContext(ThemeContext);

  return (
    <div className={`max-w-4xl mt-4 mx-auto p-4 sm:p-8 rounded-xl shadow-lg ${
      isDark ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}>
      <div className="space-y-4 w-full">
        {semesterData.map((subject) => (
          <div key={subject.code} className={`${
            isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
          } transition-colors duration-200 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4`}>
            <div className="flex-1 items-start w-full">
              <span className={`text-base sm:text-lg font-medium ${
                isDark ? "text-gray-100" : "text-gray-700"
              }`}>{subject.code}</span>
              <p className={`text-sm sm:text-base ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>{subject.name}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <a href={subject.PYQ} className={`pyq-btn ${
                isDark ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"
              }`} download>PYQ</a>
              <a href={subject.notes} className={`notes-btn ${
                isDark ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"
              }`} download>Notes</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterComponent;
