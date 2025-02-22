import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";
import { useSelector } from "react-redux";

const ProtectedLayout = () => {
    const { currentUser, isLoading } = useSelector((state) => state.auth);
      if (isLoading) {
        return <div>Loading...</div>; // Show a loading state while checking auth
      }
    return currentUser ? (
      <>
        <Navbar />

        {/* Sidebar + Content */}
        <div className="">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}

          <Outlet />

          <LeftSidebar />
        </div>
      </>
    ) : (
      <Navigate to="/login" replace />
    );

};

export default ProtectedLayout;
