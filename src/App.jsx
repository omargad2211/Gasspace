import { Route, Routes } from "react-router-dom";
import PublicLayout from "./Layouts/PublicLayout";
import Home from "./pages/Home";
import SignUpForm from "./pages/register/SignUp";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<SignUpForm />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
