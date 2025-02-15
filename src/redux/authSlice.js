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
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Wait a bit to allow Firebase to update the photoURL
      await user.reload();
      const refreshedUser = auth.currentUser;

      dispatch(
        setUser({
          uid: refreshedUser.uid,
          email: refreshedUser.email,
          displayName: refreshedUser.displayName,
          photoURL: refreshedUser.photoURL, // Ensure updated photoURL
        })
      );
    } else {
      dispatch(setUser(null));
    }
  });
};


export default authSlice.reducer;
