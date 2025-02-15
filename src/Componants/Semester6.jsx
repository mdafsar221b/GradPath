import React from 'react';

const Semester6 = () => {
  const SubjectNames = [
    { name: " Advance Networks and Network Security ",
      key: "BCA-601",
      path: ""
     },
    { name: " Web Development Tools and Techniques ",
      key: "BCA-602",
      path:"/src/assets/Resources/Semester1/C_programming_notes_.pdf"
     },
  ];
  return (
    
    <div className="card">
      <h1  className="button"> Semester 6 </h1>
            {SubjectNames.map((SubjectName) => (
      
                <a href={SubjectName.path} key={SubjectName.key} download> {SubjectName.name} </a>


            ))}
          </div>
      
    )
};

export default Semester6;
