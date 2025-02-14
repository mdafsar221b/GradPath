import React from 'react';

const Semester6 = () => {
  const SubjectNames = [
    { name: " Functional English",
      key: "BCA 101"
     },
    { name: " Indroduction to Computer Programming in C",
      key: "BCA 102"
     },
    { name: " IT Tools and Applications",
      key: "BCA 103"
     },
    { name: " Mathametics",
      key: "BCA 104"
     }
   
  ];
  return (
    
    <div className="card">
      <h1  className="button"> Semester 6 </h1>
            {SubjectNames.map((SubjectName) => (
      
                <a key={SubjectName.key}> {SubjectName.name} </a>


            ))}
          </div>
      
    )
};

export default Semester6;
