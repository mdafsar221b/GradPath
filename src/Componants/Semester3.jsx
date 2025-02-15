import React from 'react';

const Semester3 = (SubjectNames) => {
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
