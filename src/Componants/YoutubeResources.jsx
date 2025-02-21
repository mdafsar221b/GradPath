import React, { useContext } from "react";
import { ResourceDetails } from "../utils/constants";
import ThemeContext from "../context/ThemeContext";


const YoutubeResources = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className={`w-full max-w-4xl mt-4 mx-auto p-4 sm:p-6 ${isDark ? 'bg-black' : 'bg-white'} rounded-xl shadow-lg flex flex-wrap gap-1 sm:gap-2 justify-center items-center`}>



     
        {ResourceDetails.map((ResourceDetail, index) => (
          <div key={index} className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-200 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-lg mb-2 sm:mb-3`}>



            <a
              href= {ResourceDetail.link}
              target="_blank"
            >
            <div className="flex-1 items-start w-full">
              <span className="text-base sm:text-lg font-medium text-black dark:text-gray-200">

                {" "}
                {ResourceDetail.title}
              </span>
              <p className="text-sm sm:text-base text-gray-600 dark:text-black mb-2">

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
