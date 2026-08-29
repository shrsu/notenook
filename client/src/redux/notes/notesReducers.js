export const notesReducers = {
  addNote: (state, action) => {
    state.notes.unshift(action.payload);
  },
  updateUpdatedNote: (state, action) => {
    console.log(action.payload);
    state.notes = state.notes.map((note) =>
      note._id === action.payload.noteId ? { ...note, ...action.payload } : note
    );
  },
  removeDeletedNote: (state, action) => {
    state.notes = state.notes.filter((note) => note._id !== action.payload);
  },
  updateMarkedNote: (state, action) => {
    state.notes = state.notes.map((note) =>
      note._id === action.payload.noteId
        ? { ...note, markedForReview: true }
        : note
    );
  },
  updateUnmarkedNote: (state, action) => {
    state.notes = state.notes.map((note) =>
      note._id === action.payload.noteId
        ? { ...note, markedForReview: false }
        : note
    );
  },
  resetError: (state) => {
    state.error = null;
  },
};
