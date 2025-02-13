import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firbase";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getPosts: builder.query({
      async queryFn() {
        try {
          const postsCollection = collection(db, "posts");
          const postsSnapshot = await getDocs(postsCollection);
          const postsList = postsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp
              ? doc.data().timestamp.toMillis()
              : null,
          }));
          return { data: postsList };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded }) {
        try {
          await cacheDataLoaded;
          const unsubscribe = onSnapshot(
            collection(db, "posts"),
            (snapshot) => {
              updateCachedData(() =>
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                  timestamp: doc.data().timestamp
                    ? doc.data().timestamp.toMillis()
                    : null,
                }))
              );
            }
          );
          return () => unsubscribe();
        } catch (error) {
          console.error("Error in real-time listener:", error);
        }
      },
    }),

    addPost: builder.mutation({
      async queryFn(postData) {
        try {
          await addDoc(collection(db, "posts"), {
            ...postData,
            timestamp: serverTimestamp(), // Firestore server timestamp
          });
          return { data: "Post added successfully" };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = postsApi;
