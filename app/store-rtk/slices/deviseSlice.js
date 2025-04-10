'use client'
import {createSlice} from "@reduxjs/toolkit";

const deviseSlice = createSlice({
  name: "devise",
  initialState: {
    devises: [],
  },
  reducers: {

    ajoutDevise: (state, action) => {
      state.devises = action.payload;
    },
    selectionDevise: (state, action) => {
    },
    suppressionDevise: (state) => {
        state.devises = [];
    }
  },
});

export const { ajoutDevise, selectionDevise, suppressionDevise} = deviseSlice.actions;

export default deviseSlice.reducer;