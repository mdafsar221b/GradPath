import React from "react";
import { semFourSub } from "../utils/constants";

const Semester4 = (SubjectNames) => {
  return (
    <div className="card">
      <h1 className="button"> Semester 4 </h1>
      {semFourSub.map((SubjectName, index) => (
        <p>{SubjectName.name} </p>
      ))}
    </div>
  );
};

export default Semester4;
