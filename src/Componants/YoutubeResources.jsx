import React from "react";
import { ResourceDetails } from "../utils/constants";

const YoutubeResources = () => {
  return (
    <div className="w-full max-w-4xl mt-4 mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg flex flex-wrap gap-1 sm:gap-2 justify-center items-center ">

     
        {ResourceDetails.map((ResourceDetail, index) => (
          <div key={index} className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-lg mb-2 sm:mb-3">

            <a
              href= {ResourceDetail.link}
              target="_blank"
            >
            <div className="flex-1 items-start w-full">
              <span className="text-base sm:text-lg font-medium text-gray-700">
                {" "}
                {ResourceDetail.title}
              </span>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                {ResourceDetail.channel}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="  ">
                  <img
                    src={ResourceDetail.thumbnail}
                    alt="Thumbnails"
                    className="w-50"
                  />
              </div>
            </div>
                </a>
          </div>
        ))}
    </div>
  );
};

export default YoutubeResources;
