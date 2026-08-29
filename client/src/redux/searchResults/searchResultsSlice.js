import { createSlice } from "@reduxjs/toolkit";

const searchResultsReducers = {
  setSearchNotesPrompt: (state, action) => {
    state.searchNotesPrompt = action.payload;
  },
  setSearchNotesResults: (state, action) => {
    state.searchNotesResults = action.payload;
  },
  setSearchUsersPrompt: (state, action) => {
    state.searchUsersPrompt = action.payload;
  },
  setSearchUsersResults: (state, action) => {
    state.searchUsersResults = action.payload;
  },
};

const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState: {
    searchNotesPrompt: "",
    searchNotesResults: null,
    searchUsersPrompt: "",
    searchUsersResults: null,
  },
  reducers: searchResultsReducers,
});

export const {
  setSearchNotesPrompt,
  setSearchNotesResults,
  setSearchUsersPrompt,
  setSearchUsersResults,
} = searchResultsSlice.actions;

export default searchResultsSlice.reducer;
