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
    updateProfile: builder.mutation({
      async queryFn({ displayName, img, bioText, headerImage, location }) {
        try {
          const user = auth.currentUser;
          if (!user) throw new Error("User not logged in");

          let photoURL = user.photoURL;
          let headerImageURL = "";

          // Upload profile image if provided
          if (img) {
            const storageRef = ref(storage, `usersImages/${user.uid}`);
            const uploadTask = uploadBytesResumable(storageRef, img);

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

          // Upload header image if provided
          if (headerImage) {
            const headerRef = ref(storage, `headers/${user.uid}`);
            const headerUploadTask = uploadBytesResumable(
              headerRef,
              headerImage
            );

            await new Promise((resolve, reject) => {
              headerUploadTask.on(
                "state_changed",
                null,
                (error) => reject(error),
                async () => {
                  headerImageURL = await getDownloadURL(
                    headerUploadTask.snapshot.ref
                  );
                  resolve();
                }
              );
            });
          }

          // Update Firebase Auth profile
          await updateProfile(user, {
            displayName: displayName || user.displayName,
            photoURL,
          });

          // Reload user to get updated info
          await user.reload();
          const updatedUser = auth.currentUser;

          // Update Firestore with additional fields
          await setDoc(
            doc(db, "users", updatedUser.uid),
            {
              uid: updatedUser.uid,
              displayName: updatedUser.displayName,
              email: updatedUser.email,
              photoURL: updatedUser.photoURL,
              bioText: bioText || "",
              location: location || "",
              headerImage: headerImageURL || "",
            },
            { merge: true }
          );

          return {
            data: {
              ...updatedUser,
              bioText,
              headerImage: headerImageURL,
              location,
            },
          };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const { useSignUpMutation, useUpdateProfileMutation } = authApi;
