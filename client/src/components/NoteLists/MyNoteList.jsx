import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import {
  updateMarkedNote,
  updateUnmarkedNote,
  removeDeletedNote,
} from "../../redux/notes/notesSlice";
import { removeDeletedPostedNote } from "../../redux/notes/postedNotesSlice";

import MyNote from "../NoteCards/MyNote";
import DeleteAlert from "../MyNotesPageComponents/DeleteAlert";
import ErrorAlert from "../MyNotesPageComponents/ErrorAlert";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

const token = extractTokenFromCookie();

import {
  markNoteForReview,
  unmarkNoteForReview,
} from "../../Functions/reviewNoteActions";

const deleteNote = async (noteId) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_REACT_APP_DELETE_NOTE_ENDPOINT}/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return noteId;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
};

function MyNoteList() {
  const notes = useSelector((state) => state.notes.notes);
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
      await deleteNote(deleteNoteId);
      dispatch(removeDeletedNote(deleteNoteId));
      dispatch(removeDeletedPostedNote(deleteNoteId));
    } catch (err) {
      setError(err);
      setShowError(true);
    }
  };

  const handleMarkForReview = async (noteId) => {
    try {
      await markNoteForReview(noteId);
      dispatch(updateMarkedNote({ noteId }));
    } catch (err) {
      setError(err);
      setShowError(true);
    }
  };

  const handleUnmarkForReview = async (noteId) => {
    try {
      await unmarkNoteForReview(noteId);
      dispatch(updateUnmarkedNote({ noteId }));
    } catch (err) {
      setError(err);
      setShowError(true);
    }
  };

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
      {notes.map((note) => (
        <MyNote
          key={note._id}
          note={note}
          confirmDelete={confirmDelete}
          handleMarkForReview={() => handleMarkForReview(note._id)}
          handleUnmarkForReview={() => handleUnmarkForReview(note._id)}
        />
      ))}
    </div>
  );
}

export default MyNoteList;
