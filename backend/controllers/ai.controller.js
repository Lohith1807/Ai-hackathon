const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.chat = async (req, res, next) => {
  try {
    const { prompt, context, stats } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'Gemini API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let systemInstruction = `You are a helpful, professional AI healthcare assistant for Care Navigator. Keep responses brief (1-3 sentences maximum) so they can be spoken aloud quickly. Don't use markdown or special characters.`;

    if (context === 'admin') {
      systemInstruction += ` You are talking to a hospital admin. The current system stats are: ${JSON.stringify(stats)}. Answer their questions about these stats if asked.`;
    } else {
      systemInstruction += ` You are talking to a patient. You help them find hospitals and book appointments on this platform.`;
    }

    const fullPrompt = `${systemInstruction}\n\nUser: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    res.status(200).json({ success: true, response: text.trim() });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI response' });
  }
};
