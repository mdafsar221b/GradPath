import React, { useState } from "react";
import { fetchGeminiResponse } from "../api/gemini";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion"; 

const ChatBotCard = () => {
    const [input, setInput] = useState("");
    const [chat, setChat] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setChat((prev) => [...prev, userMessage]);

        const result = await fetchGeminiResponse(input);
        const botResponse = { text: result, sender: "bot" };
        setChat((prev) => [...prev, botResponse]);

        setInput(""); // Clear input after sending
    };

    return (
        <div className="flex flex-col items-center justify-center w-full p-4">
            <div className="w-full max-w-lg shadow-xl rounded-lg flex flex-col h-[80vh] bg-white relative">
                
                {/* Chatbot Header with Pop-up Button */}
                <div className="bg-black text-white p-4 rounded-t-lg text-center font-semibold flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <p>Chat Bot</p>
                        <img src="/src/assets/AI-logo.svg" alt="logo" className="w-8" />
                    </div>
                    <button 
                        onClick={() => setIsPopupOpen(true)} 
                        className="px-3 py-1 bg-white text-black text-sm rounded-lg hover:bg-gray-500 transition"
                    >
                        Info
                    </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chat.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`p-3 max-w-xs rounded-lg ${msg.sender === "user" ? "bg-black text-white" : "bg-gray-300 text-gray-900"}`}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSubmit} className="flex p-3">
                    <input
                        type="text"
                        placeholder="Ask me Anything..."
                        className="flex-1 p-3 border rounded-lg focus:outline-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" className="ml-2 px-4 py-2 bg-black text-white rounded-lg">
                        Send
                    </button>
                </form>
            </div>

            {/* Pop-up Modal */}
            <AnimatePresence>
                {isPopupOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/50"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h2 className="text-xl font-semibold mb-3">Chatbot Info</h2>
                            <p className="text-gray-600">This AI chatbot can answer your queries. Feel free to ask anything!</p>
                            <button 
                                onClick={() => setIsPopupOpen(false)} 
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatBotCard;
