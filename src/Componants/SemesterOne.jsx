import React from 'react'
import SemesterCard from './SemesterCard';

const SemesterOne= () => {
    const Semester = [
  { name: " Functional English" },
  { name: " Indroduction to Computer Programming in C" },
  { name: " IT Tools and Applications" },
  { name: " Mathametics" }
 
];
  return (
    <div>
         <h3 className="text-2xl font-semibold mt-12">BCA DDU Semester</h3>
        <div className="mt-6 flex items-center justify-center flex-wrap gap-6">
          {Semester.map((Semester, index) => (
            <SemesterCard Semester={Semester} key={index} />
          ))}
        </div>
    </div>
  )
}

export default SemesterOne