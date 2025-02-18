import React from "react";
import { semTwoSub } from "../utils/constants";

const Semester2 = (SubjectNames) => {
  return (
    <div className="max-w-4xl mt-4 mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-lg">
      <div className="space-y-4 w-full">

         {semTwoSub.map((SubjectName) => (
           <div  key={SubjectName.code} className=" bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
 
             <div className="flex-1 items-start w-full">
               <span className="text-base sm:text-lg font-medium text-gray-700">{SubjectName.code}</span>
               <p className="text-sm sm:text-base text-gray-600">{SubjectName.name}</p>
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
               <a href="" className="pyq-btn">PYQ</a>
               <a href="" className="notes-btn">Notes</a>
             </div>
 
           </div>
         ))}
       </div>
    </div>
  );

};

export default Semester2;
