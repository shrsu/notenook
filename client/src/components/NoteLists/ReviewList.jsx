import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MyReviewNote from "../NoteCards/MyReviewNote";
import MySavedReviewNote from "../NoteCards/MySavedReviewNote";
import ErrorAlert from "../MyNotesPageComponents/ErrorAlert";

import { updateUnmarkedSavedNote } from "../../redux/notes/savedNotesSlice";
import { updateUnmarkedNote } from "../../redux/notes/notesSlice";

import { unmarkNoteForReview } from "../../Functions/reviewNoteActions";

function ReviewList() {
  const notes = useSelector((state) => state.notes.notes);
  const savedNotes = useSelector((state) => state.savedNotes.savedNotes);

  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleUnmarkForReview = async (noteId) => {
    try {
      await unmarkNoteForReview(noteId);
      dispatch(updateUnmarkedNote({ noteId }));
    } catch (err) {
      setError(err);
      setShowError(true);
    }
  };

  const handleUnmarkSavedNoteForReview = async (noteId) => {
    try {
      await unmarkNoteForReview(noteId);
      dispatch(updateUnmarkedSavedNote({ noteId }));
    } catch (err) {
      setError(err);
      setShowError(true);
    }
  };

  const filteredNotes = notes.filter((note) => note.markedForReview);
  const filteredSavedNotes = savedNotes.filter(
    (savedNote) => savedNote.savedNote.markedForReview
  );

  return (
    <Tabs defaultValue="Normal" className="w-full flex flex-col">
      <ErrorAlert
        error={error}
        setError={setError}
        showError={showError}
        setShowError={setShowError}
      />
      <TabsList className="self-end mb-4">
        <TabsTrigger value="Normal">My Notes</TabsTrigger>
        <TabsTrigger value="Saved">Saved Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="Normal">
        <div className="grid reviewList min-h-20 grid-cols-1 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] auto-rows-min gap-2">
          {!filteredNotes.length && (
            <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-sm text-neutral-300 text-center">
              Your Review List Appears here
            </p>
          )}
          {filteredNotes.map((note) => (
            <MyReviewNote
              key={note._id}
              note={note}
              handleUnmarkForReview={handleUnmarkForReview}
            />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="Saved">
        <div className="grid reviewList min-h-20 grid-cols-1 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] auto-rows-min gap-2">
          {!filteredSavedNotes.length && (
            <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-sm text-neutral-300 text-center">
              Your Saved Notes Review List Appears here
            </p>
          )}
          {filteredSavedNotes.map((savedNote) => (
            <MySavedReviewNote
              key={savedNote.savedNote._id}
              savedNote={savedNote.savedNote}
              originalNoteId={savedNote.originalNote}
              handleUnmarkForReview={handleUnmarkSavedNoteForReview}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default ReviewList;
