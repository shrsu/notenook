/**
 * Seeds a local database with sample notes so the assistant and its evaluation
 * can be run without touching real data.
 *
 * Two of the notes carry their body in an attached PDF rather than the editor,
 * which exercises the storage-fetch path in ingest.
 *
 * Run: node eval/seed_dev_notes.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const { NoteModel } = require("../src/models/NoteModel");

const delta = (text) => ({ ops: [{ insert: text + "\n" }] });
const owner = new mongoose.Types.ObjectId();

const notes = [
  { title: "Database Normalisation", subject: "DBMS", document: delta(
    "Normalisation removes redundancy by decomposing tables. First normal form requires atomic column values. " +
    "Second normal form removes partial dependencies on a composite key. Third normal form removes transitive " +
    "dependencies, so no non-key column depends on another non-key column. BCNF is stricter than 3NF and requires " +
    "every determinant to be a candidate key.") },
  { title: "Indexing and B-Trees", subject: "DBMS", document: delta(
    "A B-tree index keeps keys sorted and balanced so lookups cost O(log n) disk reads. Clustered indexes store " +
    "the row data in index order, so a table can only have one. Covering indexes answer a query entirely from the " +
    "index without touching the heap.") },
  { title: "TCP Three Way Handshake", subject: "Computer Networks", document: delta(
    "The TCP three way handshake opens a connection with SYN, SYN-ACK, then ACK. The client picks an initial " +
    "sequence number, the server acknowledges it and sends its own, and the client acknowledges that. This " +
    "synchronises sequence numbers in both directions before any data flows.") },
  { title: "HTTP Caching Headers", subject: "Computer Networks", document: delta(
    "Cache-Control max-age sets how long a response stays fresh. ETag lets a client revalidate with " +
    "If-None-Match and receive 304 Not Modified when unchanged. Vary tells caches which request headers change " +
    "the response.") },
  { title: "Process Synchronisation", subject: "Operating Systems", document: delta(
    "A critical section must satisfy mutual exclusion, progress and bounded waiting. A semaphore is an integer " +
    "with atomic wait and signal operations. Deadlock needs four conditions to hold at once: mutual exclusion, " +
    "hold and wait, no preemption, and circular wait.") },
  { title: "Virtual Memory and Paging", subject: "Operating Systems", document: delta(
    "Paging splits memory into fixed size frames and pages, removing external fragmentation. A page fault traps " +
    "to the kernel which loads the page from disk. Thrashing happens when the working set exceeds available " +
    "frames and the system spends most time paging.") },
  { title: "Time Complexity Basics", subject: "Algorithms", document: delta(
    "Merge sort runs in O(n log n) time and O(n) extra space. Quicksort averages O(n log n) but degrades to " +
    "O(n squared) on already sorted input with a poor pivot. Binary search needs a sorted array and runs in " +
    "O(log n).") },
  { title: "Dynamic Programming", subject: "Algorithms", document: delta(
    "Dynamic programming applies when a problem has optimal substructure and overlapping subproblems. " +
    "Memoisation caches results top down, tabulation fills a table bottom up. The knapsack problem is solved " +
    "in O(nW) time.") },
  // Two notes whose body lives in an attached PDF rather than the editor
  { title: "CPU Scheduling", subject: "Operating Systems", document: delta("See attached lecture handout."),
    fileReference: { fileName: "os-scheduling.pdf", url: "http://localhost:8099/os-scheduling.pdf" } },
  { title: "Phases of a Compiler", subject: "Compiler Design", document: delta("See attached handout."),
    fileReference: { fileName: "compiler-phases.pdf", url: "http://localhost:8099/compiler-phases.pdf" } },
];

(async () => {
  await mongoose.connect(process.env.DB_URI);
  await NoteModel.deleteMany({});
  await NoteModel.insertMany(notes.map((n) => ({ ...n, postedBy: owner })));
  console.log("seeded notes:", await NoteModel.countDocuments());
  console.log("with pdfs   :", await NoteModel.countDocuments({ "fileReference.url": { $exists: true } }));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
