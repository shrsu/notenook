const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../auth/authenticateJWT");

const noteControllers = require("../controllers/noteControllers");

router.use(authenticateJWT);

router.post("/createNewNote", noteControllers.createNewNote);

router.post("/addPostedNote", noteControllers.addPostedNote);

router.delete("/deletePostedNote/:noteId", noteControllers.deletePostedNote);

router.patch("/updateNote", noteControllers.updateNote);

router.delete("/deleteNote/:noteId", noteControllers.deleteNote);

router.patch(
  "/updateNoteFileReferences",
  noteControllers.updateNoteFileReferences
);

router.delete(
  "/deleteNoteFileReferences/:noteId",
  noteControllers.deleteNoteFileReferences
);

router.get("/searchNotes", noteControllers.searchNotes);

router.get("/getNotes", noteControllers.getNotes);

router.get("/getNote", noteControllers.getNote);

router.get("/viewNote", noteControllers.viewNote);

router.post("/saveNote/:documentId", noteControllers.saveNote);

router.delete("/deleteSavedNote/:documentId", noteControllers.deleteSavedNote);

router.get("/getSavedNotes", noteControllers.getSavedNotes);

router.get("/getPostedNotes", noteControllers.getPostedNotes);

router.patch(
  "/markNoteForReview/:documentId",
  noteControllers.markNoteForReview
);

router.patch(
  "/unmarkNoteForReview/:documentId",
  noteControllers.unmarkNoteForReview
);

module.exports = router;
