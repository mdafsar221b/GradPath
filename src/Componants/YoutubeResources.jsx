import React from "react";

const YoutubeResources = () => {
  return (
    <div className="max-w-4xl mt-4 mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-lg ">
      <div className="space-y-4 w-full flex flex-col ">
        <div className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-4 ">
          <div className="flex-1 items-start w-full">
            <span className="text-base sm:text-lg font-medium text-gray-700">
              {" "}
              C Programming 
            </span>
            <p className="text-sm sm:text-base text-gray-600">College Wallah</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div>

              <div>
                <a href=" https://www.youtube.com/watch?v=rQoqCP7LX60&list=PLxgZQoSe9cg1drBnejUaDD9GEJBGQ5hMt" target="_blank" >
                <img src="src\assets\CW.png" alt=""  className="w-2xs"/>
                  {" "}
                <img
                  src="src\assets\youtube-svgrepo-com.svg"
                  alt=""
                  className="w-10"
                />
                
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeResources;
