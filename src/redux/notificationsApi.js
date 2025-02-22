import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firbase";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    // Fetch notifications for a user
    getNotifications: builder.query({
      async queryFn(userId) {
        try {
          const q = query(
            collection(db, "notifications"),
            where("toUserId", "==", userId)
          );
          const querySnapshot = await getDocs(q);
          const notifications = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: doc.data().timestamp
                ? doc.data().timestamp.toMillis()
                : null,
            };
          });

          return { data: notifications };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: (result, error, userId) => [
        { type: "Notifications", id: userId },
      ],
    }),

    // Create a new notification
    createNotification: builder.mutation({
      async queryFn({
        toUserId,
        fromUserId,
        type,
        postId = null,
        photoURL,
        displayName,
      }) {
        try {
          const notifRef = doc(collection(db, "notifications")); // Store in a single collection
          await setDoc(notifRef, {
            toUserId,
            fromUserId,
            type,
            postId,
            timestamp: Timestamp.now(), // Use Firebase timestamp
            seen: false,
            photoURL,
            displayName,
          });

          return { data: "Notification Sent" };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: [{ type: "Notifications" }],
    }),

    // Mark notification as seen
    markAsSeen: builder.mutation({
      async queryFn({ notificationId }) {
        try {
          const notifRef = doc(db, "notifications", notificationId);
          await updateDoc(notifRef, { seen: true });

          return { data: "Notification Seen" };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: [{ type: "Notifications" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useCreateNotificationMutation,
  useMarkAsSeenMutation,
} = notificationsApi;
