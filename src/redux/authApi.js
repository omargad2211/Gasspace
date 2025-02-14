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

          await updateProfile(res.user, { displayName, photoURL });

          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL,
          });

          await setDoc(doc(db, "usersPosts", res.user.uid), { messages: [] });

          return { data: res.user };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const { useSignUpMutation } = authApi;
