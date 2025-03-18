

const SocialIcons = ({ Icons }) => {
  return (
    <div className="text-teal-500">
      <h1 className=" m-3 font-mono font-bold text-white text-xl">Feedbacks</h1>
      {Icons.map((icon) => (
        <a
          key={icon.name}
          href={icon.link}
          target="_blank"
          className="p-2 cursor-pointer inline-flex items-center
        rounded-full bg-gray-700 mx-1.5 text-xl hover:text-gray-100 hover:bg-teal-500
        duration-300 "
        >
         <img src={icon.name}  className="w-5"/>
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;