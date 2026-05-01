const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const extractText = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  return parts.map(part => part.text || '').join('\n').trim();
};

const stripJsonFence = (text) => {
  const trimmed = text.trim();
  if (!trimmed.startsWith('```')) return trimmed;
  return trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
};

const generateText = async (prompt, options = {}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.35,
        maxOutputTokens: options.maxOutputTokens ?? 2200,
        responseMimeType: options.json ? 'application/json' : 'text/plain',
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${detail}`);
  }

  const payload = await response.json();
  return extractText(payload);
};

const generateJson = async (prompt, fallback) => {
  const text = await generateText(prompt, { json: true, maxOutputTokens: 3500 });
  try {
    return JSON.parse(stripJsonFence(text));
  } catch (error) {
    if (fallback !== undefined) return fallback;
    throw error;
  }
};

module.exports = {
  generateText,
  generateJson,
};
