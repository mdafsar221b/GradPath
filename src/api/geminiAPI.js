import axios from "axios";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const fetchGeminiResponse = async (prompt) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error fetching Gemini API:", error);
        return "Error fetching response.";
    }
};
