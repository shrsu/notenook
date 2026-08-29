import { useState, useEffect } from "react";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import {
  updateMarkedSavedNote,
  updateUnmarkedSavedNote,
  removeUnsavedNote,
} from "../../redux/notes/savedNotesSlice";

import SavedNote from "../NoteCards/SavedNote";
import DeleteAlert from "../MyNotesPageComponents/DeleteAlert";
import ErrorAlert from "../MyNotesPageComponents/ErrorAlert";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

import {
  markNoteForReview,
  unmarkNoteForReview,
} from "../../Functions/reviewNoteActions";

const deleteSavedNote = async (noteId) => {
  try {
    const token = extractTokenFromCookie();
    if (!token) return;

    await axios.delete(
      `${import.meta.env.VITE_REACT_APP_DELETE_SAVED_NOTE_ENDPOINT}/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting saved note:", error);
    throw error.response ? error.response.data.error : error.message;
  }
};

function SavedList() {
  const savedNotes = useSelector((state) => state.savedNotes.savedNotes);

  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [showError, setShowError] = useState(false);

  const confirmDelete = (noteId) => {
    setDeleteNoteId(noteId);
    setDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSavedNote(deleteNoteId);
      dispatch(removeUnsavedNote({ savedNoteId: deleteNoteId }));
    } catch (err) {
      setError(err);
      setShowError(true);
    }
    setDeleteConfirmation(false);
    setDeleteNoteId(null);
  };

  const handleMarkForReview = async (noteId) => {
    try {
      await markNoteForReview(noteId);
      dispatch(updateMarkedSavedNote({ noteId }));
    } catch (err) {
      setError(err);
      setShowError(true);
    }
  };

  const handleUnmarkForReview = async (noteId) => {
    try {
      await unmarkNoteForReview(noteId);
      dispatch(updateUnmarkedSavedNote({ noteId }));
    } catch (err) {
      setError(err);
      setShowError(true);
    }
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 justify-center pr-2">
      <DeleteAlert
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
        handleDelete={handleDelete}
      />
      <ErrorAlert
        error={error}
        setError={setError}
        showError={showError}
        setShowError={setShowError}
      />
      {savedNotes.map((note) => (
        <SavedNote
          key={note.savedNote._id}
          savedNote={note.savedNote}
          originalNoteId={note.originalNote}
          confirmDelete={confirmDelete}
          handleMarkForReview={handleMarkForReview}
          handleUnmarkForReview={handleUnmarkForReview}
        />
      ))}
    </div>
  );
}

export default SavedList;
