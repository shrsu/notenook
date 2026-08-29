import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { notesReducers } from "./notesReducers";

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_GET_NOTE_ENDPOINT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.notes;
    } catch (error) {
      throw error.response ? error.response.data.error : error.message;
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    loading: false,
    error: null,
  },
  reducers: notesReducers,
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch notes. Please try again.";
      });
  },
});

export const {
  addNote,
  updateUpdatedNote,
  updateMarkedNote,
  updateUnmarkedNote,
  removeDeletedNote,
  resetError,
} = notesSlice.actions;

export default notesSlice.reducer;
