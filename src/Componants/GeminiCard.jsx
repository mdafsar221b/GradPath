import React from 'react'
import { fetchGeminiResponse } from '../api/gemini';
import ReactMarkdown from "react-markdown";
import { useState } from 'react';
const GeminiCard = () => {
    const [input, setInput] = useState("");
        const [response, setResponse] = useState("");
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!input) return;
            const result = await fetchGeminiResponse(input);
            setResponse(result);
            console.log(result)
        };
  return (
    <div className="flex flex-col items-center justify-center bg-[#f2e9e4] p-6">
            <h1 className="text-2xl font-bold mb-4">Gemini Chatbot</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Ask something..."
                    className="p-3 border rounded-lg w-80"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Submit
                </button>
            </form>
            {response && (
                <div className="mt-4 p-4 bg-white shadow-lg rounded-lg w-80 overflow-y-scroll h-150">
                    <h2 className="font-semibold">Response:</h2>
                    <ReactMarkdown >{response}</ReactMarkdown>
            
                </div>
            )}
        </div>
  )
}

export default GeminiCard