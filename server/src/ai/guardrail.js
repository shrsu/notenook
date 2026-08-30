/**
 * Two checks that stop the model inventing answers.
 *
 * 1. Retrieval floor - if nothing in the notes is close enough to the question,
 *    refuse before spending a generation call.
 * 2. Grounding check - the answer must cite retrieved chunks, so a model that
 *    ignored the context and answered from its own memory gets caught.
 */

const { config } = require("./config");

const REFUSAL = "That isn't covered in your notes.";

const CITATION = /\[(\d+)\]/g;

const passesRetrievalFloor = (hits, threshold = config.similarityThreshold) =>
  hits.length > 0 && hits[0].score >= threshold;

const isGrounded = (answer, hitCount) => {
  const cited = [...new Set([...answer.matchAll(CITATION)].map((m) => Number(m[1])))].sort(
    (a, b) => a - b
  );
  if (!cited.length) return { grounded: false, cited: [] };

  // Every citation must point at a chunk we actually retrieved.
  const inRange = cited.filter((n) => n >= 1 && n <= hitCount);
  return { grounded: inRange.length === cited.length, cited: inRange };
};

module.exports = { REFUSAL, passesRetrievalFloor, isGrounded };
