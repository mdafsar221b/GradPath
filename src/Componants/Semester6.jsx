import React from "react";
import { semSixSub } from "../utils/constants";

const Semester6 = (SubjectNames) => {
  return (
    <div className="card">
      <h1 className="button"> Semester 6 </h1>
      {semSixSub.map((SubjectName) => (
        <p> {SubjectName.name} </p>
      ))}
    </div>
  );
};

export default Semester6;
