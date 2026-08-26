const { AppError } = require('../middleware/errorHandler');

const getTriageResult = async (symptomsText) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
You are a medical triage assistant. Your job is to assess the following symptoms and provide a triage recommendation.
IMPORTANT RULES:
1. NEVER give a definitive medical diagnosis.
2. Flag red-flag or emergency symptoms explicitly.
3. Classify risk as "low", "medium", or "high".
4. Briefly explain your reasoning.
5. If the risk is medium or high, always recommend seeking professional care.
6. Return ONLY a valid JSON object with the exact keys: "riskLevel" (string: low, medium, or high), "reasoning" (string), "recommendation" (string). No markdown blocks or extra text.

Symptoms to assess:
"${symptomsText}"
`;

    // Using fetch for the API call
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error('Failed to get response from Gemini API');
    }

    const data = await response.json();
    const textOutput = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON string
    // Remove markdown code blocks if the model still returns them despite instructions
    const cleanedText = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanedText);

    return result;

  } catch (error) {
    console.error('Triage generation error:', error);
    throw new AppError('Error processing triage assessment. Please try again.', 500);
  }
};

module.exports = { getTriageResult };
