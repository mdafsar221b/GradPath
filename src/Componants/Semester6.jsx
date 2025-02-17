import React from "react";
import { semSixSub } from "../utils/constants";

const Semester6 = (SubjectNames) => {
 return (
     <div className=" max-w-4xl mt-4 mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-lg">
         {/* <h1 className="heading text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">Semester One Syllabus</h1> */}
       <div className="space-y-4 w-full">
         {semSixSub.map((SubjectName) => (
           <div  key={SubjectName.code} className=" bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
 
             <div className="flex-1 items-start w-full">
               <span className="text-base sm:text-lg font-medium text-gray-700">{SubjectName.code}</span>
               <p className="text-sm sm:text-base text-gray-600">{SubjectName.name}</p>
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
               <a href="" className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm sm:text-base text-center">PYQ</a>
               <a href="" className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base text-center">Notes</a>
             </div>
 
           </div>
         ))}
       </div>
     </div>
   );
};

export default Semester6;
