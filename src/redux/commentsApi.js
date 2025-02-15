import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firbase";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getComments: builder.query({
      async queryFn(postID) {
        try {
          const commentsCollection = collection(db, "comments");
          const commentsQuery = query(
            commentsCollection,
            where("postID", "==", postID)
          );
          const commentsSnapshot = await getDocs(commentsQuery);
          const commentsList = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp
              ? doc.data().timestamp.toMillis()
              : null,
          }));
          return { data: commentsList };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onCacheEntryAdded(postID, { updateCachedData, cacheDataLoaded }) {
        try {
          await cacheDataLoaded;
          const commentsCollection = collection(db, "comments");
          const commentsQuery = query(
            commentsCollection,
            where("postID", "==", postID)
          );

          const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            updateCachedData(() =>
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp
                  ? doc.data().timestamp.toMillis()
                  : null,
              }))
            );
          });
          return () => unsubscribe();
        } catch (error) {
          console.error("Error in real-time listener:", error);
        }
      },
    }),

    addComment: builder.mutation({
      async queryFn(commentData) {
        try {
          await addDoc(collection(db, "comments"), {
            ...commentData,
            timestamp: serverTimestamp(), // Firestore server timestamp
          });
          return { data: "Comment added successfully" };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const { useGetCommentsQuery, useAddCommentMutation } = commentsApi;
