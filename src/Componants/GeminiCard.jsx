import React from 'react'
import { useState } from 'react';
import { fetchGeminiResponse } from '../api/geminiAPI';

const GeminiCard = () => {

    const [input, setInput] = useState("");
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input) return;

        setLoading(true); // Show "Thinking..."
        const result = await fetchGeminiResponse(input);
        setLoading(false); // Hide "Thinking..."

        // Split response into paragraphs and format **bold** text
        const formattedResponse = result.split("\n\n").map((para) =>
            para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        );

        setResponse(formattedResponse);
    };
  return (
    <div className='p-15 border-1'>
        <div className="flex flex-col items-center justify-center  bg-gray-100 p-6 border-1">
            <h1 className="text-2xl font-bold mb-4">Your Friendly ChatBot</h1>
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
            {loading ? (
                <div className="mt-4 p-4 bg-white shadow-lg rounded-lg w-80 text-center text-gray-500">
                    Thinking...
                </div>
            ) : response.length > 0 && (
                <div className="mt-4 p-4 bg-white shadow-lg rounded-lg  overflow-y-scroll">
                    <h2 className="font-semibold mb-2">Response:</h2>
                    {response.map((para, index) => (
                        <p key={index} className="mb-2 text-gray-700" dangerouslySetInnerHTML={{ __html: para }}></p>
                    ))}
                </div>
            )}
        </div> 
    </div>
  )
};

export default GeminiCard