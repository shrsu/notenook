export const postedNotesReducers = {
  addPostedNote: (state, action) => {
    state.postedNotes.unshift(action.payload);
  },
  updateUpdatedPostedNote: (state, action) => {
    state.postedNotes = state.postedNotes.map((note) =>
      note.note === action.payload.noteId
        ? { ...note, ...action.payload }
        : note
    );
  },
  removeDeletedPostedNote: (state, action) => {
    state.postedNotes = state.postedNotes.filter(
      (note) => note.note !== action.payload
    );
  },
  resetError: (state) => {
    state.error = null;
  },
};
