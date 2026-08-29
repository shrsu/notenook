const { UserModel } = require("../models/UserModel");
const { NoteModel } = require("../models/NoteModel");
const { PostedNoteModel } = require("../models/PostedNoteModel");
const mongoose = require("mongoose");
const { validateData } = require("../validation/validator");
const {
  newNoteJoiSchema,
  updateNoteJoiSchema,
  updateNoteFileReferenceJoiSchema,
} = require("../validation/noteJoiSchemas");
const { isOwner } = require("../utils/verifyNoteAuthor");

const createNewNote = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { title, subject } = req.body;

    const validationResult = validateData({ title, subject }, newNoteJoiSchema);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: validationResult.error.details[0].message });
    }

    const newNote = new NoteModel({
      postedBy: user._id,
      title,
      subject,
    });

    const savedNote = await newNote.save();

    user.notes.push(savedNote._id);

    await user.save();
    return res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addPostedNote = async (req, res) => {
  try {
    const { title, subject, noteId } = req.body;

    if (!title || !subject || !noteId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingNote = await NoteModel.findById(noteId);
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!isOwner(req.user._id, existingNote.postedBy)) {
      return unauthorizedUserError(res);
    }

    if (existingNote.postedNote) {
      return res.status(400).json({ message: "Note already Posted" });
    }

    const { _id } = req.user;

    const postedNote = new PostedNoteModel({
      postedBy: _id,
      title,
      subject,
      note: noteId,
    });

    await postedNote.save();
    existingNote.postedNote = postedNote._id;
    await existingNote.save();

    await UserModel.findByIdAndUpdate(_id, {
      $addToSet: { postedNotes: postedNote._id },
    });

    return res
      .status(201)
      .json({ message: "Posted note added successfully", postedNote });
  } catch (error) {
    console.error("Error adding posted note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deletePostedNote = async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const note = await NoteModel.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const postedNoteId = note.postedNote;

    if (!postedNoteId) {
      return res.status(400).json({ message: "Note not posted" });
    }

    const postedNote = await PostedNoteModel.findById(postedNoteId).select(
      "postedBy"
    );
    if (!isOwner(req.user._id, postedNote.postedBy)) {
      return unauthorizedUserError(res);
    }

    await PostedNoteModel.findByIdAndDelete(postedNoteId);

    note.postedNote = undefined;
    await note.save();

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.postedNotes.indexOf(postedNoteId);
    if (index !== -1) {
      user.postedNotes.splice(index, 1);
    }
    await user.save();

    res
      .status(204)
      .json({ message: "Posted note deleted successfully", _id: postedNoteId });
  } catch (error) {
    console.error("Error deleting posted note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId, title, subject } = req.body;

    const validationResult = validateData(
      {
        title,
        subject,
      },
      updateNoteJoiSchema
    );

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details });
    }

    const note = await NoteModel.findById(noteId).select("postedBy");
    if (!isOwner(req.user._id, note.postedBy)) {
      return unauthorizedUserError(res);
    }

    const updatedNote = await NoteModel.findByIdAndUpdate(
      noteId,
      { title, subject },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    const postedNote = await PostedNoteModel.findOne({ note: noteId });
    if (postedNote) {
      postedNote.title = title;
      postedNote.subject = subject;
      await postedNote.save();
    }

    res.json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const note = await NoteModel.findById(noteId).select(
      "postedBy postedNote markedForReview"
    );
    if (!isOwner(req.user._id, note.postedBy)) {
      return unauthorizedUserError(res);
    }

    const postedNoteId = note.postedNote;

    if (postedNoteId) {
      await PostedNoteModel.findByIdAndDelete(postedNoteId);
    }

    const update = {
      $pull: { notes: noteId },
    };

    if (note.markedForReview) {
      update.$inc = { reviewListCount: -1 };
    }

    await UserModel.findByIdAndUpdate(req.user.id, update);

    await NoteModel.findByIdAndDelete(noteId);

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    return handleInternalError(res, error, "Error deleting note:");
  }
};

const updateNoteFileReferences = async (req, res) => {
  try {
    const { noteId, fileName, url } = req.body;

    const validationResult = validateData(
      { noteId, fileName, url },
      updateNoteFileReferenceJoiSchema
    );

    if (validationResult.error) {
      return res.status(400).json({
        error: "Validation error",
        details: validationResult.error.details,
      });
    }

    const note = await NoteModel.findById(noteId).select("postedBy");
    if (!isOwner(req.user._id, note.postedBy)) {
      return unauthorizedUserError(res);
    }

    const updatedNote = await NoteModel.findByIdAndUpdate(
      noteId,
      { fileReference: { fileName, url } },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({
      message: "File references updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Error updating file references:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteNoteFileReferences = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const note = await NoteModel.findById(noteId);

    if (!isOwner(req.user._id, note.postedBy)) {
      return unauthorizedUserError(res);
    }

    note.fileReference = undefined;

    await note.save();

    res.json({ message: "File references deleted successfully" });
  } catch (error) {
    return handleInternalError(res, error, "Error deleting file references:");
  }
};

const searchNotes = async (req, res) => {
  try {
    const { searchInput } = req.query;
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    const escapedSearchInput = escapeRegExp(searchInput);

    const query = {
      $or: [
        { title: { $regex: escapedSearchInput, $options: "i" } },
        { subject: { $regex: escapedSearchInput, $options: "i" } },
      ],
    };

    const notes = await PostedNoteModel.find(query).populate({
      path: "postedBy",
      select: "username avatar",
    });

    return res.status(200).json({ notes });
  } catch (error) {
    console.error("Error searching notes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getNotes = async (req, res) => {
  try {
    const UserNotes = await UserModel.findById(req.user.id)
      .select("notes")
      .populate({
        path: "notes",
        select: "title subject updatedAt markedForReview",
        options: { sort: { updatedAt: -1 } },
      });

    if (!UserNotes) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ notes: UserNotes.notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getNote = async (req, res) => {
  try {
    const { documentId } = req.query;

    const note = await NoteModel.findById(documentId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const noteData = {
      _id: note._id,
      title: note.title,
      subject: note.subject,
      fileReference: note.fileReference,
      updatedAt: note.updatedAt,
      postedNote: note.postedNote || null,
    };

    res.json({ note: noteData });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const viewNote = async (req, res) => {
  try {
    const { documentId } = req.query;
    const userId = req.user._id;

    if (!documentId) {
      return res.status(400).json({ error: "Document ID is required" });
    }

    const note = await NoteModel.findById(documentId).populate({
      path: "postedBy",
      select: "username avatar",
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const isOwner = note.postedBy._id.equals(userId);

    let isSaved = false;

    if (!isOwner) {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      isSaved = user.savedNotes.some(
        (entry) =>
          entry.originalNote.equals(documentId) ||
          entry.savedNote.equals(documentId)
      );
    }

    res.json({ note, isOwner, isSaved });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const saveNote = async (req, res) => {
  const userId = req.user._id;
  const noteId = req.params.documentId;

  try {
    const originalNote = await NoteModel.findById(noteId);

    if (!originalNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    const newNote = new NoteModel({
      postedBy: originalNote.postedBy,
      title: originalNote.title,
      subject: originalNote.subject,
      fileReference: originalNote.fileReference,
      document: originalNote.document,
    });

    const savedNewNote = await newNote.save();

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          savedNotes: { originalNote: noteId, savedNote: savedNewNote._id },
        },
      },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json({ originalNote: noteId, savedNote: savedNewNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSavedNote = async (req, res) => {
  const userId = req.user._id;
  const noteId = req.params.documentId;

  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savedNoteEntry = user.savedNotes.find(
      (entry) =>
        entry.savedNote.toString() === noteId ||
        entry.originalNote.toString() === noteId
    );

    if (!savedNoteEntry) {
      return res
        .status(403)
        .json({ error: "Saved note not found in user's saved notes" });
    }

    const note = await NoteModel.findById(savedNoteEntry.savedNote);

    const isMarkedForReview = note?.markedForReview;

    await NoteModel.findByIdAndDelete(savedNoteEntry.savedNote);

    const update = {
      $pull: { savedNotes: { _id: savedNoteEntry._id } },
    };

    if (isMarkedForReview) {
      update.$inc = { reviewListCount: -1 };
    }

    await UserModel.findByIdAndUpdate(userId, update);

    res.status(200).json({
      message: "Saved note deleted successfully",
      savedNoteId: savedNoteEntry.savedNote,
    });
  } catch (error) {
    console.error("Error deleting saved note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSavedNotes = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId).populate({
      path: "savedNotes.savedNote",
      select: "_id title subject markedForReview createdAt",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savedNotes = user.savedNotes.map((entry) => ({
      _id: entry._id,
      originalNote: entry.originalNote,
      savedNote: {
        _id: entry.savedNote._id,
        title: entry.savedNote.title,
        subject: entry.savedNote.subject,
        markedForReview: entry.savedNote.markedForReview,
        createdAt: entry.savedNote.createdAt,
      },
    }));

    res.status(200).json({ savedNotes });
  } catch (error) {
    console.error("Error fetching saved notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPostedNotes = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId).populate({
      path: "postedNotes",
      select: "_id title subject note createdAt",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const postedNotes = user.postedNotes;
    res.status(200).json({ postedNotes });
  } catch (error) {
    console.error("Error fetching saved notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markNoteForReview = async (req, res) => {
  const userId = req.user._id;
  const { documentId } = req.params;

  try {
    const noteUpdateResult = await NoteModel.updateOne(
      { _id: documentId, markedForReview: { $ne: true } },
      { $set: { markedForReview: true } }
    );

    if (noteUpdateResult.modifiedCount > 0) {
      await UserModel.updateOne(
        { _id: userId },
        { $inc: { reviewListCount: 1 } }
      );
      return res
        .status(200)
        .json({ message: "Note marked for review successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Note already marked for review or not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const unmarkNoteForReview = async (req, res) => {
  const userId = req.user._id;
  const { documentId } = req.params;

  try {
    const noteUpdateResult = await NoteModel.updateOne(
      { _id: documentId, markedForReview: true },
      { $set: { markedForReview: false } }
    );

    if (noteUpdateResult.modifiedCount > 0) {
      await UserModel.updateOne(
        { _id: userId },
        { $inc: { reviewListCount: -1 } }
      );
      return res
        .status(200)
        .json({ message: "Note unmarked from review successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Note not marked for review or not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createNewNote,
  addPostedNote,
  deletePostedNote,
  updateNote,
  deleteNote,
  updateNoteFileReferences,
  deleteNoteFileReferences,
  searchNotes,
  getNotes,
  getNote,
  viewNote,
  saveNote,
  deleteSavedNote,
  getSavedNotes,
  getPostedNotes,
  markNoteForReview,
  unmarkNoteForReview,
};
