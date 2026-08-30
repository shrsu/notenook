/**
 * Retrieval and guardrail evaluation.
 *
 * A retrieval-augmented system fails in two opposite directions, so both are
 * measured separately:
 *
 *   answerable    - the answer IS in the notes. Did we retrieve the right note
 *                   (recall@1, recall@k) and produce a cited answer?
 *   unanswerable  - the answer is NOT in the notes. Did the guardrails refuse
 *                   instead of inventing something?
 *
 * The answerable set is run through the full ask() path rather than retrieval
 * alone, so a broken generation model shows up here instead of passing silently.
 *
 * Run: npm run eval
 */

const fs = require("fs");
const path = require("path");

const { ask } = require("../src/ai/answer");
const { config } = require("../src/ai/config");
const { retrieve } = require("../src/ai/retrieve");

const percentile = (values, p) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
};

const main = async () => {
  const golden = JSON.parse(fs.readFileSync(path.join(__dirname, "golden_set.json"), "utf-8"));

  let hitsAt1 = 0;
  let hitsAtK = 0;
  let groundedAnswers = 0;
  const askLatencies = [];
  const retrievalLatencies = [];

  for (const item of golden.answerable) {
    const retrievalStart = Date.now();
    const hits = await retrieve(item.question);
    retrievalLatencies.push(Date.now() - retrievalStart);
    const rank = hits.findIndex((h) => h.source === item.expectedSource) + 1;
    if (rank === 1) hitsAt1 += 1;
    if (rank > 0) hitsAtK += 1;

    const result = await ask(item.question);
    askLatencies.push(result.latencyMs);
    // A good answer is one that came back at all AND cited a retrieved chunk.
    const grounded = !result.refused && result.sources.length > 0;
    if (grounded) groundedAnswers += 1;

    const rankLabel = rank > 0 ? `rank ${rank}` : "MISS";
    console.log(`${grounded ? "OK  " : "BAD "} ${rankLabel.padEnd(7)} ${item.question}`);
    if (!grounded) console.log(`         ${result.reason || result.answer.slice(0, 90)}`);
  }

  let refusals = 0;
  for (const question of golden.unanswerable) {
    const result = await ask(question);
    askLatencies.push(result.latencyMs);
    if (result.refused) refusals += 1;
    console.log(`${result.refused ? "REFUSED " : "LEAKED  "} ${question}`);
    if (!result.refused) console.log(`         ${result.answer.slice(0, 90)}`);
  }

  const answerable = golden.answerable.length || 1;
  const unanswerable = golden.unanswerable.length || 1;

  const results = {
    ranAt: new Date().toISOString(),
    embedModel: config.embedModel,
    chatModel: config.chatModel,
    topK: config.topK,
    similarityThreshold: config.similarityThreshold,
    recallAt1: +(hitsAt1 / answerable).toFixed(3),
    recallAtK: +(hitsAtK / answerable).toFixed(3),
    groundedAnswerRate: +(groundedAnswers / answerable).toFixed(3),
    refusalRate: +(refusals / unanswerable).toFixed(3),
    retrievalP95Ms: percentile(retrievalLatencies, 95),
    askP95Ms: percentile(askLatencies, 95),
    // ask latency includes free-tier rate-limit backoff, so retrieval is the
    // honest measure of the system's own speed.
    note: "askP95Ms includes API backoff waits on the free tier",
    counts: { answerable, unanswerable, hitsAt1, hitsAtK, groundedAnswers, refusals },
  };

  console.log("\n" + JSON.stringify(results, null, 2));
  fs.writeFileSync(
    path.join(__dirname, `results_${Date.now()}.json`),
    JSON.stringify(results, null, 2)
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
