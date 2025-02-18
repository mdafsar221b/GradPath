import React from "react";

const About = () => {
  return (
    <div className="mt-10 w-full  mb-6  flex items-center justify-center flex-col">
      <p className="text-black mt-2 text-4xl sm:text-6xl font-bold text-center">
        Your One-Stop Hub for <br /> Notes & PYQs
      </p>
      <div>
       <p className="mt-6 text-lg text-gray-700 leading-relaxed text-center mb-3">
        <span className="font-semibold text-xl text-blue-600">
          Welcome to DDU BCA Resources!
        </span>
        <br />
        Your one-stop platform for semester-wise notes, PYQs, and study materials. We aim to provide well-organized, reliable resources to help you excel in exams and deepen your understanding. Whether revising or exploring new concepts, find everything you need here. Stay ahead in your studies with ease!
       </p>

      </div>
      <div className='flex sm:flex-none px-4 sm:px-6 sm:mt-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base text-center gap-2 items-center justify-center '>
        <a href="src\assets\Resources\Syllabus.pdf" download> Download Syllabus</a>
        <img src="src/assets/download-icon.svg" alt=""  className='w-5'/>
      </div>


    </div>
  );
};

export default About;
