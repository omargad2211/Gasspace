import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/firbase";

export const followersApi = createApi({
  reducerPath: "followersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Followers"],
  endpoints: (builder) => ({
    // Get user's following and followers
    getUserFollowData: builder.query({
      async queryFn(userID) {
        try {
          const docRef = doc(db, "followers", userID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return { data: docSnap.data() };
          } else {
            // Initialize the document if it doesn't exist
            await setDoc(docRef, { following: [], followers: [] });
            return { data: { following: [], followers: [] } };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: (result, error, userID) => [
        { type: "Followers", id: userID },
      ],
    }),

    // Follow a user
    followUser: builder.mutation({
      async queryFn({ currentUserID, targetUserID }) {
        try {
          const currentUserDocRef = doc(db, "followers", currentUserID);
          const targetUserDocRef = doc(db, "followers", targetUserID);

          // Ensure the documents exist before running the transaction
          const currentUserDoc = await getDoc(currentUserDocRef);
          if (!currentUserDoc.exists()) {
            await setDoc(currentUserDocRef, { following: [], followers: [] });
          }

          const targetUserDoc = await getDoc(targetUserDocRef);
          if (!targetUserDoc.exists()) {
            await setDoc(targetUserDocRef, { following: [], followers: [] });
          }

          // Now run the transaction
          await runTransaction(db, async (transaction) => {
            transaction.update(currentUserDocRef, {
              following: arrayUnion(targetUserID),
            });

            transaction.update(targetUserDocRef, {
              followers: arrayUnion(currentUserID),
            });
          });

          return { data: "Followed successfully" };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { currentUserID, targetUserID }) => [
        { type: "Followers", id: currentUserID },
        { type: "Followers", id: targetUserID },
      ],
    }),

    // Unfollow a user
    unfollowUser: builder.mutation({
      async queryFn({ currentUserID, targetUserID }) {
        try {
          const currentUserDocRef = doc(db, "followers", currentUserID);
          const targetUserDocRef = doc(db, "followers", targetUserID);

          const currentUserDoc = await getDoc(currentUserDocRef);
          const targetUserDoc = await getDoc(targetUserDocRef);

          if (!currentUserDoc.exists() || !targetUserDoc.exists()) {
            return { error: "User data not found" };
          }

          await runTransaction(db, async (transaction) => {
            transaction.update(currentUserDocRef, {
              following: arrayRemove(targetUserID),
            });

            transaction.update(targetUserDocRef, {
              followers: arrayRemove(currentUserID),
            });
          });

          return { data: "Unfollowed successfully" };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { currentUserID, targetUserID }) => [
        { type: "Followers", id: currentUserID },
        { type: "Followers", id: targetUserID },
      ],
    }),
  }),
});

export const {
  useGetUserFollowDataQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = followersApi;
