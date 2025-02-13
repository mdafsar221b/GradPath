import React from 'react'


const SemesterCard = ({Semester:{name}, onClick}, index) => {


  const handleClick = (name) => {
    
  }

  return (
    <div 
        key={index}
        className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">

        <h4 className="font-bold text-lg">{name}</h4>
        <button className="mt-4 px-16 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition cursor-pointer" onClick={onClick}>


                Explore Sem{index}
        </button>
  </div>
  )
}

export default SemesterCard
