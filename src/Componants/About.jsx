import React from "react";
import Typewriter from "./Typewriter"; // Import the Typewriter component


const About = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-white mt-2 text-5xl sm:text-6xl font-bold text-center font-Flux mb-6">
        <Typewriter text="Your One-Stop Hub for Notes & PYQs" speed={100} />
      </h1>

      <div>
       <p className="mt-6 text-lg text-gray-300 leading-relaxed text-center mb-3  font-Flux">
        <span className="font-semibold text-xl text-blue-600">
          Welcome to DDU BCA Resources!
        </span>
        <br />
        Your one-stop platform for semester-wise notes, PYQs, and study materials. We aim to provide well-organized, reliable resources to help you excel in exams and deepen your understanding. Whether revising or exploring new concepts, find everything you need here. Stay ahead in your studies with ease!
       </p>

      </div>

       <div className="mt-6">
      <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out gap-2" href="/assets/Resources/Syllabus.pdf" download>
      Download Syllabus    
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" className="w-5 h-5 mr-2 -ml-1">
        <path d="M12 4v12m8-8l-8 8-8-8" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </a>

       </div>


    </div>
  );
};

export default About;
