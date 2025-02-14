import React from 'react';

const Semester1 = () => {
  const SubjectNames = [
    { name: " Functional English" },
    { name: " Indroduction to Computer Programming in C" },
    { name: " IT Tools and Applications" },
    { name: " Mathametics" }
   
  ];
  return (
    
    <div className="card ">
          <h1 className="button"> Semester 1 </h1>

      
            {SubjectNames.map((SubjectName, index) => (
      
                <a key={index} className='font-mono'>{SubjectName.name} </a>


            ))}
          </div>
      
    )
  };
  

export default Semester1;
