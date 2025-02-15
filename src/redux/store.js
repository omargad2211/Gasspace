// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { postsApi } from "./postsApi";
import { authApi } from "./authApi";
import { commentsApi } from "./commentsApi";
import { likesApi } from "./likesApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [likesApi.reducerPath]: likesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      postsApi.middleware,
      authApi.middleware,
      commentsApi.middleware,
      likesApi.middleware
    ),
});
