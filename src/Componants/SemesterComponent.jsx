import React from "react";
import { useLoaderData } from "react-router-dom";

const SemesterComponent = () => {
  const semesterData = useLoaderData();

  return (
<div className="max-w-4xl mt-4 mx-auto p-4 sm:p-8 rounded-xl border-1 border-dashed text-black font-Flux sm:text-3xl text-2xl animate-fade-in">


      <div className="space-y-4 w-full">
        {semesterData.map((subject) => (
          <div
            key={subject.code}
            className="bg-gray-50 hover:bg-gray-100  duration-200 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-transform transform hover:scale-102 "
          >
            <div className="flex-1 items-start w-full">
              <span className="text-base sm:text-lg font-medium text-gray-700">
                {subject.code}
              </span>
              <p className="text-sm sm:text-base text-gray-600">
                {subject.name}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <a
                href={subject.PYQ}
                className="pyq-btn bg-black hover:bg-black text-black"
                download
              >
                PYQ
              </a>
              <a
                href={subject.notes}
                className="notes-btn bg-gray-200 hover:bg-gray-300 text-black"
                download
              >
                Notes
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterComponent;
