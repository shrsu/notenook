const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

// Small enough that a retrieved hit is mostly signal, overlapped so a sentence
// spanning a boundary still lands intact in one of the chunks.
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 120,
  separators: ["\n\n", "\n", ". ", " ", ""],
});

const chunkText = async (text) => {
  const trimmed = (text || "").trim();
  if (!trimmed) return [];
  return splitter.splitText(trimmed);
};

module.exports = { chunkText };
