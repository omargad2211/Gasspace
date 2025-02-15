import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firbase";

export const likesApi = createApi({
  reducerPath: "likesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getLikes: builder.query({
      async queryFn(postID) {
        try {
          const likesCollection = collection(db, "likes");
          const likesQuery = query(
            likesCollection,
            where("postID", "==", postID)
          );
          const likesSnapshot = await getDocs(likesQuery);
          const likesList = likesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp
              ? doc.data().timestamp.toMillis()
              : null,
          }));
          return { data: likesList };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onCacheEntryAdded(postID, { updateCachedData, cacheDataLoaded }) {
        try {
          await cacheDataLoaded;
          const likesCollection = collection(db, "likes");
          const likesQuery = query(
            likesCollection,
            where("postID", "==", postID)
          );

          const unsubscribe = onSnapshot(likesQuery, (snapshot) => {
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

    addLike: builder.mutation({
      async queryFn({ postID, userID, photoURL, displayName }) {
        try {
          await addDoc(collection(db, "likes"), {
            postID,
            userID,
            photoURL,
            displayName,
            timestamp: serverTimestamp(),
          });
          return { data: "Like added successfully" };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    removeLike: builder.mutation({
      async queryFn({ postID, userID }) {
        try {
          const likesCollection = collection(db, "likes");
          const likeQuery = query(
            likesCollection,
            where("postID", "==", postID),
            where("userID", "==", userID)
          );
          const likeSnapshot = await getDocs(likeQuery);

          if (!likeSnapshot.empty) {
            const likeDoc = likeSnapshot.docs[0];
            await deleteDoc(doc(db, "likes", likeDoc.id));
            return { data: "Like removed successfully" };
          } else {
            return { error: "Like not found" };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const { useGetLikesQuery, useAddLikeMutation, useRemoveLikeMutation } =
  likesApi;
