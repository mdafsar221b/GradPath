import React from 'react'
import { fetchGeminiResponse } from '../api/gemini';
import ReactMarkdown from "react-markdown";
import { useState } from 'react';
const ChatBotCard = () => {const [input, setInput] = useState("");
    const [chat, setChat] = useState([]);

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
            <div className="w-full max-w-lg  shadow-xl rounded-lg flex flex-col h-[80vh]">
                
                <div className="bg-black text-white p-4 rounded-t-lg text-center font-semibold flex gap-3 justify-center items-center">
                <p>Chat Bot </p>
                <img src="/src/assets/AI-logo.svg" alt="logo" className='w-8' />
                </div>

            
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chat.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`p-3 max-w-xs text-black rounded-lg ${
                                    msg.sender === "user"
                                        ? "bg-black text-white"
                                        : "bg-gray-300 text-gray-900"
                                }`}
                            >
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>

              
                <form
                    onSubmit={handleSubmit}
                    className="flex p-3 "
                >
                    <input
                        type="text"
                        placeholder="Ask me Anything..."
                        className="flex-1 p-3 border rounded-lg focus:outline-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-black text-white rounded-lg"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBotCard