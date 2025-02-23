import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./Layouts/PublicLayout";
import Home from "./pages/Home";
import SignUpForm from "./pages/register/SignUp";
import Profile from "./pages/profile";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { authListener } from "./redux/authSlice";
import Login from "./pages/register/login";
import UserProfile from "./pages/users";
import Notifications from "./pages/notifications";
import PostPage from "./pages/post";
import ProtectedLayout from "./Layouts/ProtectedLayout";
import AllPosts from "./pages/profile/components/AllPosts";
import AllLikes from "./pages/profile/components/AllLikes";
import SavedPosts from "./pages/profile/components/SavedPosts";
import UserPosts from "./pages/users/components/UserPosts";
import UserLikes from "./pages/users/components/UserLikes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authListener());
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/profile" element={<Profile />}>
              <Route index element={<Navigate to="posts" replace />} />
              <Route path="posts" element={<AllPosts />} />
              <Route path="likes" element={<AllLikes />} />
              <Route path="saves" element={<SavedPosts />} />
            </Route>
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          <Route path="/profile/:id" element={<UserProfile />}>
            <Route index element={<Navigate to="posts" replace />} />
            <Route path="posts" element={<UserPosts />} />
            <Route path="likes" element={<UserLikes />} />
          </Route>
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
