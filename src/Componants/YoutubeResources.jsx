import React from "react";
import { ResourceDetails } from "../utils/constants";

const YoutubeResources = () => {
  return (
    <div className=" p-10 flex justify-center items-center flex-wrap gap-10 w-screen">
      {ResourceDetails.map((ResourceDetail, index) => (
        <div
          key={index}
          className="relative flex w-60 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md transition-transform transform hover:scale-102 mb-3"
        >
          <div className="relative mx-4 -mt-6  overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
            <img src={ResourceDetail.thumbnail} alt="Thumbnails" />
          </div>
          <div className="p-4 flex items-center justify-center flex-col">
            <h5 className=" block font-sans text-lg font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              {ResourceDetail.channel}
            </h5>
            <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
              {ResourceDetail.title}
            </p>
          </div>
          <div className="p-4 pt-0 flex items-center justify-center flex-col">
            <a
              href={ResourceDetail.link}
              data-ripple-light="true"
              type="button"
              className="watch-btn"
            >
              Watch
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YoutubeResources;
