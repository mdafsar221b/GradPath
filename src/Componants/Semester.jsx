import React from 'react'
import SemesterCard from './SemesterCard';

const SemesterSection = () => {
    const Semester = [
  { name: " Sem - 1" },
  { name: " Sem - 2" },
  { name: " Sem - 3" },
  { name: " Sem - 4" },
  { name: " Sem - 5" },
  { name: " Sem - 6" }
 
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

export default SemesterSection