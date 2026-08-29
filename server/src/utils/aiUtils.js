const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function getAnswerFromAI(messageHistory) {
  try {
    const res = await llm.invoke(messageHistory);

    const assistantMessage = res.lc_kwargs.content;

    return assistantMessage;
  } catch (e) {
    console.error("Error getting answer from AI:", e);
    throw new Error("Failed to get answer from AI");
  }
}

module.exports = { getAnswerFromAI };
