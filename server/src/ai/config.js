require("dotenv").config();

const config = {
  apiKey: process.env.GOOGLE_GENAI_API_KEY,

  qdrantUrl: process.env.QDRANT_URL || "http://localhost:6333",
  qdrantApiKey: process.env.QDRANT_API_KEY || undefined,
  collection: process.env.QDRANT_COLLECTION || "notenook_notes",

  embedModel: process.env.EMBED_MODEL || "gemini-embedding-001",
  chatModel: process.env.CHAT_MODEL || "gemini-3.5-flash",

  // text-embedding-004 returns 768-dimensional vectors.
  embedDim: 768,

  // Guardrail: refuse when the best match scores below this.
  // Tune with `npm run eval` rather than guessing.
  similarityThreshold: Number(process.env.SIMILARITY_THRESHOLD || 0.55),
  topK: Number(process.env.TOP_K || 5),
};

module.exports = { config };
