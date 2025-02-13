import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
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
          const postsList = postsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp ? data.timestamp.toMillis() : null, // Convert Firestore Timestamp
            };
          });
          return { data: postsList };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded }) {
        try {
          await cacheDataLoaded;
          const unsubscribe = onSnapshot(
            collection(db, "posts"),
            (snapshot) => {
              updateCachedData(() =>
                snapshot.docs.map((doc) => {
                  const data = doc.data();
                  return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp
                      ? data.timestamp.toMillis()
                      : null, // Ensure serializable timestamp
                  };
                })
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
      async queryFn(newPost) {
        try {
          await addDoc(collection(db, "posts"), {
            ...newPost,
            timestamp: new Date(), // Store current date (converted by Firestore)
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
