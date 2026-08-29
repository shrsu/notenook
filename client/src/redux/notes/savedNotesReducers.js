export const savedNotesReducers = {
  addSavedNote: (state, action) => {
    state.savedNotes.unshift(action.payload);
  },
  removeUnsavedNote: (state, action) => {
    state.savedNotes = state.savedNotes.filter(
      (note) => note.savedNote._id !== action.payload.savedNoteId
    );
  },
  updateMarkedSavedNote: (state, action) => {
    state.savedNotes = state.savedNotes.map((note) =>
      note.savedNote._id === action.payload.noteId
        ? {
            ...note,
            savedNote: { ...note.savedNote, markedForReview: true },
          }
        : note
    );
  },
  updateUnmarkedSavedNote: (state, action) => {
    state.savedNotes = state.savedNotes.map((note) =>
      note.savedNote._id === action.payload.noteId
        ? {
            ...note,
            savedNote: { ...note.savedNote, markedForReview: false },
          }
        : note
    );
  },
  resetError: (state) => {
    state.error = null;
  },
};
