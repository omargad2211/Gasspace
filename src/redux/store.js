// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { postsApi } from "./postsApi";
import { authApi } from "./authApi";
import { commentsApi } from "./commentsApi";
import { likesApi } from "./likesApi";
import { repostsApi } from "./repostsApi";
import { followersApi } from "./followersApi";
import { notificationsApi } from "./notificationsApi";
import savedReducer from "./savedSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    saved: savedReducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [likesApi.reducerPath]: likesApi.reducer,
    [repostsApi.reducerPath]: repostsApi.reducer,
    [followersApi.reducerPath]: followersApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      postsApi.middleware,
      authApi.middleware,
      commentsApi.middleware,
      likesApi.middleware,
      repostsApi.middleware,
      followersApi.middleware,
      notificationsApi.middleware
    ),
});
