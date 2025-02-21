import React from "react";

const HeaderYT = () => {
  return (
    <div className=" flex justify-center items-center flex-col mt-4">
    <div className="flex gap-3 mx-4  sm:mx-6 lg:mx-8">
      <p className=" text-3xl sm:text-4xl font-bold"> YouTube Resources</p>
      <img
        src="/src/assets/youtube-svgrepo-com.svg"
        alt=""
        className="w-10 mt[-20px]"
      />
    </div>
    <p className="mt-6 text-lg text-gray-700 leading-relaxed text-center mb-3" >
    Boost your grades with these top YouTube resources! 📚✨ These expert-curated videos simplify complex topics, making learning efficient and effective. Study smart and achieve top scores! 🚀
    </p>
    </div>
        
  );
};

export default HeaderYT;
