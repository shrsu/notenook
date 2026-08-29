import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import MyPostedNote from "../NoteCards/MyPostedNote";
import DeleteAlert from "../MyNotesPageComponents/DeleteAlert";
import ErrorAlert from "../MyNotesPageComponents/ErrorAlert";
import { removeDeletedPostedNote } from "../../redux/notes/postedNotesSlice";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
const deletePostedNote = async (noteId) => {
  try {
    const token = extractTokenFromCookie();
    if (!token) return;

    const res = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_DELETE_POSTEDNOTE_ENDPOINT}/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data._id;
  } catch (error) {
    console.error("Error deleting saved note:", error);
    throw error.response ? error.response.data.error : error.message;
  }
};

function MyPostedNotesList() {
  const postedNotes = useSelector((state) => state.postedNotes.postedNotes);
  const dispatch = useDispatch();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const confirmDelete = (noteId) => {
    setDeleteNoteId(noteId);
    setDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      await deletePostedNote(deleteNoteId);
      dispatch(removeDeletedPostedNote(deleteNoteId));
    } catch (err) {
      console.log(err);
      setError(err);
      setShowError(true);
    }
    setDeleteConfirmation(false);
    setDeleteNoteId(null);
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
      {postedNotes &&
        postedNotes.map((note) => (
          <MyPostedNote
            key={note._id}
            note={note}
            confirmDelete={confirmDelete}
          />
        ))}
    </div>
  );
}

export default MyPostedNotesList;
