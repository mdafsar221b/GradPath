import React, { useEffect, useState } from 'react';

const Typewriter = ({ text, speed }) => {
 
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length-1) {
        setDisplayedText((prev) => prev + text[index]);
        index += 1; // Move to the next character
      } else {
        clearInterval(interval); // Clear the interval when done
      }
    }, speed);
    
    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

export default Typewriter;
