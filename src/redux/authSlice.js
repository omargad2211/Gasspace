// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firbase";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    isLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setUser } = authSlice.actions;

export const authListener = () => (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );
    } else {
      dispatch(setUser(null));
    }
  });
};

export default authSlice.reducer;
