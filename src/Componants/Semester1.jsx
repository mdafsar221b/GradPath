import React from "react";
import Header from "./Header";
import { semOneSub } from "../utils/constants";

const Semester1 = () => {
  return (
    <div className="card ms:flex-col">
      <div>
      <h1 className="heading"> Semester One Syllabus</h1>
      {semOneSub.map((SubjectName) => (
        <p className="nav-link">{SubjectName.name} </p>
      ))}
     </div>

     <div>
      <div className=" flex flex-wrap flex-col">
      <p className="nav-link active text-center  ">PYQ</p>
        <ul className="flex">
          <li className="nav-link">2020</li>
          <li className="nav-link">2021</li>
          <li className="nav-link">2022</li>
          <li className="nav-link">2023</li>
          <li className="nav-link">2024</li>
        </ul>
      </div>
     </div>
    </div>
  );
};

export default Semester1;
