import { Route, Routes } from "react-router-dom";
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
