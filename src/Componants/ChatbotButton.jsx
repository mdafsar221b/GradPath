import React, { useState } from "react";
import ChatBotCard from "./ChatBotCard";
import { motion, AnimatePresence } from "framer-motion"; 
const ChatbotButton = () => {
  const [showChatBotCard, setShowChatBotCard] = useState(false);

  const toggleChatBotCard = () => {
    setShowChatBotCard((prev) => !prev);
  };

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-center z-10 ">
      {/* Chatbot Toggle Button */}
      <button
        className="bg-black shadow-2xl px-3 py-3 rounded-2xl hover:bg-gray-100 cursor-pointer flex gap-3 justify-between"
        onClick={toggleChatBotCard}
      >
        {showChatBotCard ? <img src="/src/assets/cross-circle-svg.svg" alt="AI Logo" className="max-w-6" /> : <img src="/src/assets/AI-logo.svg" alt="AI Logo" className="max-w-6 animate-pulse" />}
      </button>

      {/* Animated ChatBotCard */}
      <AnimatePresence>
        {showChatBotCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-3"
          >
            <ChatBotCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotButton;
