import Typewriter from "./Typewriter";

const HeaderYT = () => {
  return (
    <div className=" flex justify-center items-center flex-col mt-4">
    <div className="flex gap-3 mx-4  sm:mx-6 lg:mx-8">
      <p className=" text-2xl sm:text-4xl font-bold"> YouTube </p>
      <img
        src="/src/assets/youtube-svgrepo-com.svg"
        alt=""
        className="w-10 mt[-20px]"
      />
       <p className=" text-2xl sm:text-4xl font-bold">Resources</p>
    </div>
    <div className="mt-6 text-lg text-gray-700 leading-relaxed text-center mb-3 font-Flux px-6 sm:px-15 lg:px-17" >
    
    <Typewriter text="Boost your grades with these top YouTube resources! 📚✨ These expert-curated videos simplify complex topics making learning efficient and effective. Study smart and achieve top scores! 🚀" speed ={50}/>
    </div>
    </div>
        
  );
};

export default HeaderYT;
