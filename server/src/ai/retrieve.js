const { config } = require("./config");
const { embedQuery } = require("./embeddings");
const { search } = require("./vectorStore");

const retrieve = async (question, topK = config.topK) =>
  search(await embedQuery(question), topK);

module.exports = { retrieve };
