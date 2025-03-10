

const SocialIcons = ({ Icons }) => {
  return (
    <div className="text-teal-500">
      {Icons.map((icon) => (
        <a
          key={icon.name}
          href={icon.link}
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