import { Route, Routes } from "react-router-dom";
import PublicLayout from "./Layouts/PublicLayout";
import Home from "./pages/Home";
import SignUpForm from "./pages/register/SignUp";
import Profile from "./pages/profile";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { authListener } from "./redux/authSlice";
import Login from "./pages/register/login";

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
        </Route>
      </Routes>
    </>
  );
}

export default App;
