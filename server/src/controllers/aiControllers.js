const { ask } = require("../ai/answer");
const { ingest } = require("../ai/ingest");
const { stats } = require("../ai/vectorStore");

const getStats = async (req, res) => {
  try {
    res.status(200).json(await stats());
  } catch (error) {
    res.status(500).json({ error: "Failed to read index stats", details: error.message });
  }
};

const runIngest = async (req, res) => {
  const { source = "files", rebuild = false } = req.body || {};
  if (!["files", "mongo"].includes(source)) {
    return res.status(400).json({ error: "source must be 'files' or 'mongo'" });
  }

  try {
    res.status(200).json(await ingest({ source, rebuild: Boolean(rebuild) }));
  } catch (error) {
    res.status(500).json({ error: "Ingest failed", details: error.message });
  }
};

const askQuestion = async (req, res) => {
  const question = (req.body?.question || "").trim();
  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }
  if (question.length > 1000) {
    return res.status(400).json({ error: "question must be 1000 characters or fewer" });
  }

  try {
    res.status(200).json(await ask(question));
  } catch (error) {
    res.status(500).json({ error: "Failed to answer", details: error.message });
  }
};

module.exports = { getStats, runIngest, askQuestion };
