import React from 'react';

const Semester2 = () => {
  const SubjectNames = [
    { name: "Discrete Mathematics ",
      key: "BCA-201",
      path: ""
     },
    { name: " Accounting and Financial Management ",
      key: "BCA-202",
      path:"/src/assets/Resources/Semester1/C_programming_notes_.pdf"
     },
    { name: " Digital Circuit and Logic Design",
      key: "BCA-203",
     path:"\src\assets\Resources\Semester1\C Language 100 Questions Answers.pdf"
     },
    { name: " Introductions to Object Oriented Programming & C++ ",
      key: "BCA-204",
      path:"/src/assets/Resources/Semester1/IT.pdf"
     }
   
  ];
  return (
    
    <div className="card ">
      <h1  className="button"> Semester 2 </h1>
            {SubjectNames.map((SubjectName, index) => (
      
                <a key={index}>{SubjectName.name} </a>


            ))}
          </div>
      
    )
};

export default Semester2;
