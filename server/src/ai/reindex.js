/**
 * Keeps the vector index in step with the notes.
 *
 * Embedding on every save would be wasteful - the editor autosaves constantly,
 * and embedding calls are rate limited. Instead each note carries an `indexedAt`
 * stamp, and this sweep picks up only the notes edited since their last index.
 */

const { NoteModel } = require("../models/NoteModel");
const { chunkText } = require("./chunking");
const { embedDocuments } = require("./embeddings");
const { deleteByDocIds, ensureCollection, upsertChunks } = require("./vectorStore");
const { buildDocumentsForNote } = require("./ingest");

/** Notes never indexed, or edited since they were last indexed. */
const findStaleNotes = (limit) =>
  NoteModel.find({
    $expr: {
      $or: [
        { $eq: ["$indexedAt", null] },
        { $gt: ["$updatedAt", "$indexedAt"] },
      ],
    },
  })
    .sort({ updatedAt: 1 })
    .limit(limit)
    .lean();

const reindexStaleNotes = async ({ limit = 25 } = {}) => {
  const notes = await findStaleNotes(limit);
  if (!notes.length) return { scanned: 0, indexed: 0, chunks: 0 };

  await ensureCollection();

  let indexed = 0;
  let written = 0;

  for (const note of notes) {
    const docs = await buildDocumentsForNote(note);

    // Clear the old copy even when the note now yields nothing, so emptying a
    // note removes it from the index instead of leaving stale chunks behind.
    await deleteByDocIds([String(note._id)]);

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

    if (chunks.length) {
      written += await upsertChunks(chunks, await embedDocuments(chunks.map((c) => c.text)));
    }

    // timestamps:false or this write bumps updatedAt, which would leave the
    // note looking stale again on the very next sweep.
    await NoteModel.updateOne(
      { _id: note._id },
      { indexedAt: new Date() },
      { timestamps: false }
    );
    indexed += 1;
  }

  return { scanned: notes.length, indexed, chunks: written };
};

module.exports = { reindexStaleNotes };
