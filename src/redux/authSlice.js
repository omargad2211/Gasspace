// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firbase";

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

// export const authListener = () => (dispatch) => {
//   onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       // Wait a bit to allow Firebase to update the photoURL
//       await user.reload();
//       const refreshedUser = auth.currentUser;

//       dispatch(
//         setUser({
//           uid: refreshedUser.uid,
//           email: refreshedUser.email,
//           displayName: refreshedUser.displayName,
//           photoURL: refreshedUser.photoURL, // Ensure updated photoURL
//           bioText: refreshedUser.bioText || "",
//           location: refreshedUser.location || "",
//           headerImage: refreshedUser.headerImage || "",
//         })
//       );
//     } else {
//       dispatch(setUser(null));
//     }
//   });
// };

export const authListener = () => (dispatch) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Reload to get latest data
      await user.reload();
        const refreshedUser = auth.currentUser;
        // console.log(refreshedUser.metadata.creationTime);

      // Fetch additional user details from Firestore
      const userDoc = await getDoc(doc(db, "users", refreshedUser.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        //   console.log(userData);
        dispatch(
          setUser({
            uid: refreshedUser.uid,
            email: refreshedUser.email,
            displayName: refreshedUser.displayName,
            photoURL: refreshedUser.photoURL,
            bioText: userData.bioText || "",
            headerImage: userData.headerImage || "",
            location: userData.location || "",
            creationTime:refreshedUser.metadata.creationTime
          })
        );
      }
    } else {
      dispatch(setUser(null));
    }
  });
};
export const updateUser = (user) => (dispatch) => {
  dispatch(
    setUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      bioText: user.bioText || "",
      location: user.location || "",
      headerImage: user.headerImage || "",
    })
  );
};

export default authSlice.reducer;
