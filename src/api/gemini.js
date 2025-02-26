import axios from "axios";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const fetchGeminiResponse = async (prompt) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );

        if (response.data && response.data.candidates) {
            return response.data.candidates[0]?.content?.parts[0]?.text || "No response received.";
        } else {
            return "Unexpected response format.";
        }
        
        // Fixed response structure
    } catch (error) {
        console.error("Error fetching Gemini API:", error.response?.data || error.message);
        return "Error fetching response.";
    }
};
