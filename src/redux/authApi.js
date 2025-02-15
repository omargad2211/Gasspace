import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase/firbase";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      async queryFn({ displayName, email, password, img }) {
        try {
          const res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          let photoURL = "";

          if (img) {
            const storageRef = ref(storage, `usersImages/${displayName}`);
            const uploadTask = uploadBytesResumable(storageRef, img);

            // Wait for image upload to complete
            await new Promise((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                null,
                (error) => reject(error),
                async () => {
                  photoURL = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve();
                }
              );
            });
          }

          // Update user profile with displayName and photoURL
          await updateProfile(res.user, { displayName, photoURL });

          // Reload user to get updated profile info
          await res.user.reload();
          const updatedUser = auth.currentUser;

          // Store user details in Firestore
          await setDoc(doc(db, "users", updatedUser.uid), {
            uid: updatedUser.uid,
            displayName: updatedUser.displayName,
            email: updatedUser.email,
            photoURL: updatedUser.photoURL,
          });

          await setDoc(doc(db, "usersPosts", updatedUser.uid), {
            messages: [],
          });

          return { data: updatedUser }; // Return updated user
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const { useSignUpMutation } = authApi;
