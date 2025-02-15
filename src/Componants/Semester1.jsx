import React from 'react';
import Header from './Header';
import { semOneSub } from '../utils/constants';

const Semester1 = () => {
  
  return (
     <>
     
    <div className="card  ">
         
    <h1  className="button"> Semester 1 </h1>
      
            {semOneSub.map((SubjectName, index) => (
      
                <a key={index} className='font-mono'>{SubjectName.name} </a>


            ))}
          </div>
     </>
      
    )
  };
  

export default Semester1;
