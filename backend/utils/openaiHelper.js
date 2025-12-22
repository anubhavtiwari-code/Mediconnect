import OpenAI from "openai";

export async function callOpenAIForSummary(promptText) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const resp = await client.responses.create({
    model: "gpt-4o-mini", // or "gpt-4o" if available
    input: `${promptText}\n\nPlease produce a concise, structured medical summary with headings: History, Findings, Impression, Recommendations, Medications, Next Steps.`,
    max_output_tokens: 800
  });
  // adapt to your library's response shape
  if (resp?.output?.[0]?.content?.[0]?.text) return resp.output[0].content[0].text;
  // fallback: join output items
  return resp.output.map(o => (o.text || o)).join("\n");
}
