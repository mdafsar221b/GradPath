import React from 'react'
import { useState } from 'react';
import ChatBotCard from './ChatBotCard';

const ChatbotButton = () => {
    const [showChatBotCard, setShowChatBotCard] = useState(false);

    const toggleChatBotCard = () => {
     setShowChatBotCard((prev) => !prev);
   };
  return (
    <div className='mx-auto flex items-center justify-center flex-col'>
          
          <button
            className=" bg-white shadow-2xl px-10 py-3 rounded-2xl hover:bg-gray-100 cursor-pointer flex gap-3 justify-between"
            onClick={toggleChatBotCard}
          >
            {" "}
            {showChatBotCard ? "Close Chat Bot" : "Open Chat Bot"}
            <img src="/src/assets/AI-logo.svg" alt="" className="max-w-6" />
          </button>
          {showChatBotCard && <ChatBotCard />}
        
    </div>
  )
}

export default ChatbotButton