import React from 'react';

const Semester4 = () => {
  const SubjectNames = [
    { name: "DBMS",
      key: "BCA-401",
      path: ""
     },
    { name: "  Operation Research",
      key: "BCA-402",
      path:"/src/assets/Resources/Semester1/C_programming_notes_.pdf"
     },
    { name: " COMPUTER GRAPHICS",
      key: "BCA-403",
     path:"\src\assets\Resources\Semester1\C Language 100 Questions Answers.pdf"
     },
    { name: "Software Engineering ",
      key: "BCA-404",
      path:"/src/assets/Resources/Semester1/IT.pdf"
     }
   
  ];
  return (
    
    <div className="card">
      <h1  className="button"> Semester 4 </h1>
            {SubjectNames.map((SubjectName, index) => (
      
                <a key={index}>{SubjectName.name} </a>


            ))}
          </div>
      
    )
};

export default Semester4;
