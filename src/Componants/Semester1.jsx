import React from 'react';
import Header from './Header';

const Semester1 = () => {
  const SubjectNames = [
    { name: " IT Tools and Applications  ",
      key: "BCA-101",
      path: ""
     },
    { name: " Principles of Mathematics ",
      key: "BCA-102",
      path:"/src/assets/Resources/Semester1/C_programming_notes_.pdf"
     },
    { name: "Functional English",
      key: "BCA-103",
     path:"\src\assets\Resources\Semester1\C Language 100 Questions Answers.pdf"
     },
    { name: "Introduction to Computer Programming in ‘C’",
      key: "BCA-104",
      path:"/src/assets/Resources/Semester1/IT.pdf"
     }
   
  ];
  return (
     <>
     
    <div className="card  ">
         
    <h1  className="button"> Semester 1 </h1>
      
            {SubjectNames.map((SubjectName, index) => (
      
                <a key={index} className='font-mono'>{SubjectName.name} </a>


            ))}
          </div>
     </>
      
    )
  };
  

export default Semester1;
