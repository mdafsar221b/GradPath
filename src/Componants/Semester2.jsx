import React from 'react';
import { semTwoSub } from '../utils/constants';

const Semester2 = (SubjectNames) => {
  return (
    
    <div className="card ">
      <h1  className="button"> Semester 2 </h1>
            {semTwoSub.map((SubjectName, index) => (
      
                <a key={index}>{SubjectName.name} </a>


            ))}
          </div>
      
    )
};

export default Semester2;
