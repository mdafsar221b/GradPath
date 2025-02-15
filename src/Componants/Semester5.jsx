import React from "react";
import { semFiveSub } from "../utils/constants";

const Semester5 = (SubjectNames) => {
  return (
    <div className="card">
      <h1 className="button"> Semester 5 </h1>
      {semFiveSub.map((SubjectName, index) => (
        <p>{SubjectName.name} </p>
      ))}
    </div>
  );
};

export default Semester5;
