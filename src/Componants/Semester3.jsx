import React from 'react';

const Semester3 = () => {
  const SubjectNames = [
    { name: "Operating System",
      key: "BCA-301",
      path: ""
     },
    { name: " Computer Oriented Mathematics",
      key: "BCA-302",
      path:"/src/assets/Resources/Semester1/C_programming_notes_.pdf"
     },
    { name: "Data Structure",
      key: "BCA-303",
     path:"\src\assets\Resources\Semester1\C Language 100 Questions Answers.pdf"
     },
    { name: " Computer Organization and Architecture ",
      key: "BCA-304",
      path:"/src/assets/Resources/Semester1/IT.pdf"
     }
   
  ];
  return (
    
    <div className="card">
      <h1  className="button"> Semester 3 </h1>
            {SubjectNames.map((SubjectName, index) => (
      
                <a key={index}>{SubjectName.name} </a>


            ))}
          </div>
      
    )
};

export default Semester3;
