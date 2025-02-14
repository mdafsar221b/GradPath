import React from 'react';

const Semester4 = () => {
  const SubjectNames = [
    { name: " Functional English" },
    { name: " Indroduction to Computer Programming in C" },
    { name: " IT Tools and Applications" },
    { name: " Mathametics" }
   
  ];
  return (
    
    <div className="card">
      <h1  className="button"> Semester 4 </h1>
            {SubjectNames.map((SubjectName, index) => (
      
                <li key={index}>{SubjectName.name} </li>


            ))}
          </div>
      
    )
};

export default Semester4;
