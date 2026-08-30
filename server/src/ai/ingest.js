/**
 * Build the search index from NoteNook's own content.
 *
 * A note carries two bodies: the rich-text document written in the editor
 * (stored as a Quill delta) and an optional PDF uploaded alongside it (stored
 * in Firebase, referenced by URL). Both are indexed, so a question can be
 * answered from either.
 *
 * The `files` source reads ad-hoc documents from server/data instead, which is
 * useful for trying the assistant without a populated database.
 */

const fs = require("fs/promises");
const path = require("path");

const mongoose = require("mongoose");

const { NoteModel } = require("../models/NoteModel");
const { chunkText } = require("./chunking");
const { embedDocuments } = require("./embeddings");
const {
  deleteByDocIds,
  ensureCollection,
  reset,
  stats,
  upsertChunks,
} = require("./vectorStore");

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const TEXT_EXT = new Set([".md", ".txt"]);

/** Extract the text layer from a PDF, page by page. */
const parsePdf = async (buffer) => {
  // The legacy build is the CommonJS-friendly one.
  const pdfjs = require("pdfjs-dist/legacy/build/pdf.mjs");

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    // Node has no canvas or system fonts, and we only want the text.
    disableFontFace: true,
    useSystemFonts: false,
  }).promise;

  const pages = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const content = await (await doc.getPage(n)).getTextContent();
    pages.push(content.items.map((item) => item.str ?? "").join(" "));
  }
  await doc.destroy();
  return pages.join("\n");
};

/** Quill stores rich text as a delta; the readable content is the insert ops. */
const deltaToText = (document) => {
  const ops = document?.ops;
  if (!Array.isArray(ops)) return "";
  return ops
    .map((op) => (typeof op.insert === "string" ? op.insert : ""))
    .join("")
    .trim();
};

const fetchPdf = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return parsePdf(Buffer.from(await response.arrayBuffer()));
};

/**
 * The server already holds an open connection; the CLI does not. Open one on
 * demand so ingest works either way, and report whether we own it so the CLI
 * can close it again.
 */
const ensureDbConnection = async () => {
  if (mongoose.connection.readyState === 1) return false;
  if (!process.env.DB_URI) {
    throw new Error("DB_URI is not set, so there is no database to read notes from.");
  }
  await mongoose.connect(process.env.DB_URI);
  return true;
};

/**
 * Turn one note into the documents that represent it: the rich-text body
 * written in the editor, and the PDF attached to it if there is one.
 */
const buildDocumentsForNote = async (note) => {
  const id = String(note._id);
  const label = note.title || id;
  const docs = [];

  const written = deltaToText(note.document);
  if (written) {
    // Subject rides along in the text so it can be matched on too.
    docs.push({
      docId: id,
      source: label,
      kind: "note",
      text: `${label}\n${note.subject || ""}\n\n${written}`,
    });
  }

  const url = note.fileReference?.url;
  if (url) {
    try {
      const pdfText = await fetchPdf(url);
      if (pdfText.trim()) {
        docs.push({
          docId: id,
          source: note.fileReference.fileName || `${label}.pdf`,
          kind: "pdf",
          text: pdfText,
        });
      }
    } catch (error) {
      // A dead storage link shouldn't abort the whole index build.
      console.warn(`Skipped PDF for note ${id}: ${error.message}`);
    }
  }

  return docs;
};

const loadFromMongo = async () => {
  const notes = await NoteModel.find(
    {},
    { title: 1, subject: 1, document: 1, fileReference: 1 }
  ).lean();

  const docs = [];
  for (const note of notes) {
    docs.push(...(await buildDocumentsForNote(note)));
  }
  return docs;
};

const loadFromFiles = async () => {
  let entries;
  try {
    entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  const docs = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const file = path.join(DATA_DIR, entry.name);
    const ext = path.extname(entry.name).toLowerCase();

    let text = "";
    if (ext === ".pdf") text = await parsePdf(await fs.readFile(file));
    else if (TEXT_EXT.has(ext)) text = await fs.readFile(file, "utf-8");
    else continue;

    if (text.trim()) {
      docs.push({
        docId: path.parse(entry.name).name,
        source: entry.name,
        kind: ext === ".pdf" ? "pdf" : "note",
        text,
      });
    }
  }
  return docs;
};

const ingest = async ({ source = "mongo", rebuild = false } = {}) => {
  let ownsConnection = false;
  if (source !== "files") ownsConnection = await ensureDbConnection();

  try {
    return await run(source, rebuild);
  } finally {
    if (ownsConnection) await mongoose.disconnect();
  }
};

const run = async (source, rebuild) => {
  const docs = source === "files" ? await loadFromFiles() : await loadFromMongo();
  if (!docs.length) {
    return { documents: 0, chunks: 0, note: "nothing found to ingest" };
  }

  await (rebuild ? reset() : ensureCollection());

  // Replace rather than append: without this a re-index leaves the previous
  // copy of each note in the collection alongside the new one.
  if (!rebuild) {
    await deleteByDocIds([...new Set(docs.map((doc) => doc.docId))]);
  }

  const chunks = [];
  for (const doc of docs) {
    const pieces = await chunkText(doc.text);
    pieces.forEach((text, chunkIndex) => {
      chunks.push({
        docId: doc.docId,
        source: doc.source,
        kind: doc.kind,
        chunkIndex,
        text,
      });
    });
  }

  // Embed in slices so a large library doesn't build one giant request.
  let written = 0;
  for (let i = 0; i < chunks.length; i += 100) {
    const window = chunks.slice(i, i + 100);
    written += await upsertChunks(window, await embedDocuments(window.map((c) => c.text)));
  }

  return {
    documents: docs.length,
    notes: docs.filter((d) => d.kind === "note").length,
    pdfs: docs.filter((d) => d.kind === "pdf").length,
    chunks: written,
    ...(await stats()),
  };
};

module.exports = { ingest, buildDocumentsForNote };
