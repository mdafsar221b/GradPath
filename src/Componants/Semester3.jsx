import React from "react";
import { semThreeSub } from "../utils/constants";

const Semester3 = (SubjectNames) => {
  return (
    <div className="card">
      <h1 className="button"> Semester 3 </h1>
      {semThreeSub.map((SubjectName) => (
        <p>{SubjectName.name} </p>
      ))}
    </div>
  );
};

export default Semester3;
