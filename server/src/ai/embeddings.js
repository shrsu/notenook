const { config } = require("./config");
const { requestWithRetry } = require("./retry");

const API_ROOT = "https://generativelanguage.googleapis.com/v1beta";

// gemini-embedding-001 is asymmetric: documents and queries must be embedded
// with different task types or retrieval quality drops noticeably.
const DOCUMENT = "RETRIEVAL_DOCUMENT";
const QUERY = "RETRIEVAL_QUERY";

// The batch endpoint caps how many inputs one call accepts.
const BATCH_SIZE = 100;

const embedBatch = async (texts, taskType) => {
  const url = `${API_ROOT}/models/${config.embedModel}:batchEmbedContents?key=${config.apiKey}`;

  const body = await requestWithRetry(
    () =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: texts.map((text) => ({
            model: `models/${config.embedModel}`,
            content: { parts: [{ text }] },
            taskType,
            // The model defaults to 3072 dimensions; 768 is plenty here and
            // keeps the Qdrant collection small. Must match config.embedDim.
            outputDimensionality: config.embedDim,
          })),
        }),
      }),
    { label: "Embedding" }
  );

  return body.embeddings.map((e) => e.values);
};

const embedDocuments = async (texts) => {
  const vectors = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    vectors.push(...(await embedBatch(texts.slice(i, i + BATCH_SIZE), DOCUMENT)));
  }
  return vectors;
};

const embedQuery = async (text) => (await embedBatch([text], QUERY))[0];

module.exports = { embedDocuments, embedQuery };
