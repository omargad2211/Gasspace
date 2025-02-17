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

export const repostsApi = createApi({
  reducerPath: "repostsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getReposts: builder.query({
      async queryFn(postID) {
        try {
          const repostsCollection = collection(db, "reposts");
          const repostsQuery = query(
            repostsCollection,
            where("postID", "==", postID)
          );
          const repostsSnapshot = await getDocs(repostsQuery);
          const repostsList = repostsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp
              ? doc.data().timestamp.toMillis()
              : null,
          }));
          return { data: repostsList };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onCacheEntryAdded(postID, { updateCachedData, cacheDataLoaded }) {
        try {
          await cacheDataLoaded;
          const repostsCollection = collection(db, "reposts");
          const repostsQuery = query(
            repostsCollection,
            where("postID", "==", postID)
          );

          const unsubscribe = onSnapshot(repostsQuery, (snapshot) => {
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

    getUserRepostedPosts: builder.query({
      async queryFn(userID) {
        try {
          const repostsCollection = collection(db, "reposts");
          const repostsQuery = query(
            repostsCollection,
            where("userID", "==", userID)
          );

          // Wait for the reposts query to complete and get the postID list
          const repostsSnapshot = await getDocs(repostsQuery);
          const repostsList = repostsSnapshot.docs.map(
            (doc) => doc.data().postID
          );

          // Now fetch posts that correspond to the reposts' postID list
          const postsCollection = collection(db, "posts");
          const postsQuery = query(
            postsCollection,
            where("id", "in", repostsList) // Assuming post `id` is used
          );

          const postsSnapshot = await getDocs(postsQuery);
          const postsList = postsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return { data: postsList };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    addRepost: builder.mutation({
      async queryFn({ postID, userID }) {
        try {
          await addDoc(collection(db, "reposts"), {
            postID,
            userID,
            timestamp: serverTimestamp(),
          });
          return { data: "Repost added successfully" };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    removeRepost: builder.mutation({
      async queryFn({ postID, userID }) {
        try {
          const repostsCollection = collection(db, "reposts");
          const repostQuery = query(
            repostsCollection,
            where("postID", "==", postID),
            where("userID", "==", userID)
          );
          const repostSnapshot = await getDocs(repostQuery);

          if (!repostSnapshot.empty) {
            const repostDoc = repostSnapshot.docs[0];
            await deleteDoc(doc(db, "reposts", repostDoc.id));
            return { data: "Repost removed successfully" };
          } else {
            return { error: "Repost not found" };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
    getAllReposts: builder.query({
      async queryFn() {
        try {
          const repostsCollection = collection(db, "reposts");
          const repostsSnapshot = await getDocs(repostsCollection);

          const repostsList = repostsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp
              ? doc.data().timestamp.toMillis()
              : null,
          }));

          return { data: repostsList };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const {
  useGetRepostsQuery,
  useAddRepostMutation,
    useRemoveRepostMutation,
    useGetUserRepostedPostsQuery,
  useGetAllRepostsQuery
} = repostsApi;
