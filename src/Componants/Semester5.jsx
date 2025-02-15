import React from 'react';

const Semester5 = () => {
  const SubjectNames = [
    { name: " Internet and JAVA Programming ",
      key: "BCA-501",
      path: ""
     },
    { name: " ORACLE and PL/SQL",
      key: "BCA-502",
      path:"/src/assets/Resources/Semester1/C_programming_notes_.pdf"
     },
    { name: "COMPUTER NETWORKS",
      key: "BCA-503",
     path:"\src\assets\Resources\Semester1\C Language 100 Questions Answers.pdf"
     },
    { name: "Software Project Management",
      key: "BCA-504",
      path:"/src/assets/Resources/Semester1/IT.pdf"
     }
   
  ];
  return (
    
    <div className="card">
      <h1  className="button"> Semester 5 </h1>
            {SubjectNames.map((SubjectName, index) => (
      
                <a key={index}>{SubjectName.name} </a>


            ))}
          </div>
      
    )
};

export default Semester5;
