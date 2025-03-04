import React from "react";
import { useLoaderData } from "react-router-dom";

const SemesterComponent = () => {
  const semesterData = useLoaderData();

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || "file.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 rounded-xl text-black font-Flux sm:text-3xl text-2xl animate-fade-in">
      <div className="space-y-4 w-full">
        {semesterData.map((subject) => (
          <div
            key={subject.code}
            className="bg-gray-50 hover:bg-gray-100 duration-200 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-transform transform hover:scale-102"
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
              <button
                onClick={() => handleDownload(subject.PYQ, `${subject.code}-PYQ.pdf`)}
                className="pyq-btn bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
              >
                PYQ
              </button>
              <button
                onClick={() => handleDownload(subject.notes, `${subject.code}-Notes.pdf`)}
                className="notes-btn bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
              >
                Notes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterComponent;
