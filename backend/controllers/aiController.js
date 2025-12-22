import OpenAI from "openai";

export const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ reply: "Invalid message format." });
    }

    // If API key is missing → fallback mode (no crash)
    if (!process.env.OPENAI_API_KEY) {
      const last = messages[messages.length - 1]?.content || "";
      return res.json({
        reply: `⚠️ AI offline: No API key set.\n\nYour message: "${last}".`
      });
    }

    // If API key exists → use OpenAI normally
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 400
    });

    const answer = completion.choices?.[0]?.message?.content || "I could not generate a response.";
    return res.json({ reply: answer });

  } catch (error) {
    console.error("AI ERROR:", error);
    return res.json({
      reply: "⚠️ AI could not process your request right now. Try again later."
    });
  }
};
