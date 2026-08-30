const { config } = require("./config");
const { REFUSAL, isGrounded, passesRetrievalFloor } = require("./guardrail");
const { requestWithRetry } = require("./retry");
const { retrieve } = require("./retrieve");

const API_ROOT = "https://generativelanguage.googleapis.com/v1beta";

const SYSTEM_PROMPT = [
  "You answer questions using only the numbered notes provided.",
  "Cite the notes you used inline as [1], [2], and so on.",
  `If the notes do not contain the answer, reply exactly: ${REFUSAL}`,
  "Never use knowledge from outside the notes.",
].join(" ");

const formatContext = (hits) =>
  hits.map((hit, i) => `[${i + 1}] (from ${hit.source})\n${hit.text}`).join("\n\n");

const generate = async (question, hits) => {
  const url = `${API_ROOT}/models/${config.chatModel}:generateContent?key=${config.apiKey}`;

  const body = await requestWithRetry(
    () =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: `Notes:\n${formatContext(hits)}\n\nQuestion: ${question}` }],
            },
          ],
          generationConfig: { temperature: 0.2 },
        }),
      }),
    { label: "Generation" }
  );

  return (body.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
};

const ask = async (question) => {
  const started = Date.now();
  const hits = await retrieve(question);

  const refuse = (reason) => ({
    answer: REFUSAL,
    refused: true,
    reason,
    sources: [],
    topScore: hits[0]?.score ?? 0,
    latencyMs: Date.now() - started,
  });

  // Guardrail 1: nothing relevant enough, so don't generate at all.
  if (!passesRetrievalFloor(hits)) {
    return refuse("no chunk cleared the similarity threshold");
  }

  const answer = await generate(question, hits);
  const { grounded, cited } = isGrounded(answer, hits.length);

  // Guardrail 2: the model answered, but did it actually use the notes?
  if (!grounded && answer !== REFUSAL) {
    return refuse("answer cited nothing retrievable");
  }

  return {
    answer,
    refused: answer === REFUSAL,
    sources: cited.map((n) => ({
      n,
      source: hits[n - 1].source,
      score: hits[n - 1].score,
    })),
    topScore: hits[0].score,
    latencyMs: Date.now() - started,
  };
};

module.exports = { ask };
