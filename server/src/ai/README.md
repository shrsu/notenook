# NoteNook Assistant — RAG over your own notes

Answers questions using only the notes you've written, with citations back to the
source note. If the answer isn't in your notes, it says so instead of guessing.

## How it works

```
note / PDF
   ↓  chunking.js      800 chars, 120 overlap, split on paragraph → line → sentence
   ↓  embeddings.js    gemini-embedding-001, task type RETRIEVAL_DOCUMENT
   ↓  vectorStore.js   Qdrant, cosine similarity
                              ↑
question ─ embeddings.js ─────┘  task type RETRIEVAL_QUERY
   ↓  retrieve.js       top-k
   ↓  guardrail.js      (1) retrieval floor
   ↓  answer.js         Gemini, forced to cite [1] [2]
   ↓  guardrail.js      (2) grounding check
answer + sources
```

`gemini-embedding-001` is asymmetric — documents and queries must be embedded with
different task types, or retrieval quality drops. That's why `embeddings.js`
exposes two functions rather than one.

## The two guardrails

Retrieval-augmented systems fail in two directions, so there are two checks.

**Retrieval floor.** If the best-matching chunk scores below
`SIMILARITY_THRESHOLD`, the request is refused before a generation call is made.
Cheaper, and it stops the model being handed irrelevant context it might paper over.

**Grounding check.** The model is instructed to cite its sources as `[1]`, `[2]`.
If the returned answer cites nothing, or cites a chunk number that wasn't
retrieved, the answer is discarded and replaced with a refusal. This catches the
case where the model ignored the notes and answered from its own training data.

## Setup

```bash
cp .env.example .env          # fill GOOGLE_GENAI_API_KEY
npm install
docker compose -f docker-compose.dev.yml up -d   # qdrant + a scratch mongo
```

## Indexing

Drop `.md`, `.txt` or `.pdf` files into `server/data/`, then:

```bash
node eval/seed_dev_notes.js      # optional: sample notes to try it against
npm run ingest                   # from the notes in MongoDB (default)
SOURCE=files npm run ingest      # from ad-hoc files in server/data
REBUILD=1 npm run ingest         # drop the collection and start clean
```

A note contributes two documents: the rich-text body written in the editor
(a Quill delta) and the PDF attached to it, fetched from storage and parsed.
A dead storage link is logged and skipped rather than failing the whole run.

## API

All routes sit behind `authenticateJWT`.

| Method | Route | Body |
| --- | --- | --- |
| `GET` | `/ai/stats` | — |
| `POST` | `/ai/ingest` | `{ "source": "files\|mongo", "rebuild": false }` |
| `POST` | `/ai/ask` | `{ "question": "..." }` |

`/ai/ask` returns the answer, the sources it cited with their scores, whether it
refused and why, and the latency.

## Evaluation

```bash
npm run eval
```

`eval/golden_set.json` holds two lists, because the two failure directions need
measuring separately:

- **`answerable`** — questions whose answer is in your notes, each paired with the
  note it should come from. Measures **recall@k**: did retrieval surface the right note?
- **`unanswerable`** — questions your notes can't answer. Measures **refusal rate**:
  did the guardrails decline instead of inventing something?

Answerable questions go through the full `ask()` path, not retrieval alone, so a
broken generation model surfaces here instead of passing silently.

Reported: `recallAt1`, `recallAtK`, `groundedAnswerRate`, `refusalRate`,
`retrievalP95Ms` and `askP95Ms`. Prefer `retrievalP95Ms` as the speed measure —
`askP95Ms` includes rate-limit backoff on the free tier.

The starter golden set is a placeholder. Replace the entries with questions about
notes you've actually indexed — the numbers mean nothing until you do.

Use it to tune `SIMILARITY_THRESHOLD`: raise it until refusal rate on the
unanswerable set hits 1.0, then check recall@k hasn't collapsed on the answerable set.

## Configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `GOOGLE_GENAI_API_KEY` | — | required, same key the rest of the server uses |
| `QDRANT_URL` | `http://localhost:6333` | |
| `QDRANT_COLLECTION` | `notenook_notes` | |
| `EMBED_MODEL` | `gemini-embedding-001` | 768 dimensions |
| `CHAT_MODEL` | `gemini-3.5-flash` | |
| `SIMILARITY_THRESHOLD` | `0.55` | tune with the eval, don't guess |
| `TOP_K` | `5` | chunks retrieved per question |

## Keeping the index current

A cron sweep in `setupCronJobs` runs every 5 minutes and re-indexes only the
notes edited since they were last indexed, tracked per note by `indexedAt`.
Embedding on every save would be wasteful - the editor autosaves constantly and
embedding calls are rate limited - so edits land in the index within a few
minutes rather than instantly.

`npm run ingest` remains available for a full pass, and re-running it replaces
each note's chunks rather than appending a second copy.

## Rate limits

Free-tier Gemini quotas are low and per-model (single-digit requests per minute,
tens per day). `retry.js` honours the `retryDelay` the API returns and falls back
to exponential backoff, so ingest and evaluation runs survive a 429 instead of
dying halfway through.

## Known limitations

- No reranking. Top-k straight from vector similarity.
- No conversation memory — each question is answered independently.
- The grounding check verifies that citations *exist and are in range*, not that
  the cited chunk genuinely supports the claim.
- It is also model-sensitive: a model that ignores the citation instruction has
  every answer rejected. `gemini-3.5-flash-lite` fails this way; `gemini-3.5-flash`
  does not.
