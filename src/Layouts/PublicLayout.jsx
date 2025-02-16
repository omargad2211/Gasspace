import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";

const PublicLayout = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
       
          <Outlet />
     
        <LeftSidebar/>
      </div>
    </div>
  );
};

export default PublicLayout;
