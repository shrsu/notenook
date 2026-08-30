const { QdrantClient } = require("@qdrant/js-client-rest");
const { randomUUID } = require("crypto");

const { config } = require("./config");

const client = new QdrantClient({
  url: config.qdrantUrl,
  apiKey: config.qdrantApiKey,
});

const collectionExists = async () => {
  const { collections } = await client.getCollections();
  return collections.some((c) => c.name === config.collection);
};

const ensureCollection = async () => {
  if (await collectionExists()) return;
  await client.createCollection(config.collection, {
    vectors: { size: config.embedDim, distance: "Cosine" },
  });
  // Needed so chunks can be deleted by the note they came from.
  await client.createPayloadIndex(config.collection, {
    field_name: "docId",
    field_schema: "keyword",
    wait: true,
  });
};

/**
 * Drop every chunk belonging to these documents.
 *
 * Point ids are random, so re-indexing a note would otherwise append a second
 * copy of it rather than replace the first. Always delete before re-upserting.
 */
const deleteByDocIds = async (docIds) => {
  if (!docIds.length) return;
  await client.delete(config.collection, {
    filter: { must: [{ key: "docId", match: { any: docIds } }] },
    wait: true,
  });
};

const upsertChunks = async (chunks, vectors) => {
  await client.upsert(config.collection, {
    wait: true,
    points: chunks.map((payload, i) => ({
      id: randomUUID(),
      vector: vectors[i],
      payload,
    })),
  });
  return chunks.length;
};

const search = async (vector, topK) => {
  const { points } = await client.query(config.collection, {
    query: vector,
    limit: topK,
    with_payload: true,
  });

  return points.map((hit) => ({
    score: hit.score,
    text: hit.payload?.text || "",
    source: hit.payload?.source || "unknown",
    kind: hit.payload?.kind || "note",
    docId: hit.payload?.docId || "",
  }));
};

const stats = async () => {
  if (!(await collectionExists())) {
    return { collection: config.collection, exists: false, chunks: 0 };
  }
  const info = await client.getCollection(config.collection);
  return {
    collection: config.collection,
    exists: true,
    chunks: info.points_count ?? 0,
  };
};

const reset = async () => {
  if (await collectionExists()) {
    await client.deleteCollection(config.collection);
  }
  await ensureCollection();
};

module.exports = {
  ensureCollection,
  deleteByDocIds,
  upsertChunks,
  search,
  stats,
  reset,
};
