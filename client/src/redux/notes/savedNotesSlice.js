import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { savedNotesReducers } from "./savedNotesReducers";

export const fetchSavedNotes = createAsyncThunk(
  "savedNotes/fetchSavedNotes",
  async (token) => {
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_GET_SAVED_NOTE_ENDPOINT}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.savedNotes;
  }
);

const savedNotesSlice = createSlice({
  name: "savedNotes",
  initialState: {
    savedNotes: [],
    loading: false,
    error: null,
  },
  reducers: savedNotesReducers,
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedNotes.fulfilled, (state, action) => {
        state.savedNotes = action.payload;
        state.loading = false;
      })
      .addCase(fetchSavedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch saved notes. Please try again.";
      });
  },
});

export const {
  addSavedNote,
  updateMarkedSavedNote,
  updateUnmarkedSavedNote,
  removeUnsavedNote,
} = savedNotesSlice.actions;

export default savedNotesSlice.reducer;
