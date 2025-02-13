import { Route, Routes } from "react-router-dom";
import PublicLayout from "./Layouts/PublicLayout";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
