import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { FaPeoplePulling } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const navigation = [
    {
      title: "Feed",
      path: "/",
      icon: <AiOutlineHome />,
    },
    {
      title: "Friends",
      path: "friends",
      icon: <FaPeoplePulling />,
    },
    {
      title: "Profile",
      path: "profile",
      icon: <IoPersonOutline />,
    },
  ];

  const { currentUser } = useSelector((state) => state.auth);

  return (
    <div className="bg-primary fixed left-0 top-20 md:top-24 flex flex-col justify-start items-start gap-4 px-2 h-screen">
      <div className="hidden md:block bg-white p-4 rounded-lg h-1/5">
        <div className="flex justify-start items-center gap-2">
          <img
            src={
              currentUser?.photoURL ||
              "publicimagesUser-Profile-PNG-Clipart.png"
            }
            alt="profile"
            className="size-8 rounded-full"
          />
          <div className="flex flex-col ">
            <p className="text-black text-sm font-semibold">
              {" "}
              {currentUser?.displayName || "User Name"}
            </p>
            <p className="text-gray-500 text-xs">@username</p>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 pt-4">
          <div className="text-center">
            <p>2.3K</p>
            <p>followers</p>
          </div>
          <div className="text-center">
            <p>2.3K</p>
            <p>following</p>
          </div>
          <div className="text-center">
            <p>23</p>
            <p>posts</p>
          </div>
        </div>
      </div>
      <div className="bg-white h-full md:h-1/2 flex flex-col items-start justify-around px-4 md:px-8 gap-4 md:w-full rounded-lg">
        {navigation.map((nav, i) => (
          <NavLink
            key={i}
            to={nav.path}
            className="text-gray-500 flex justify-center items-center gap-2 w-full"
          >
            <div className="text-lg md:text-2xl">{nav.icon}</div>
            <p className="text-base md:text-lg text-nowrap hidden md:block ">
              {nav.title}
            </p>
          </NavLink>
        ))}
        <div></div>
        <div></div>
        {/* <p className="text-black">ahmed</p> */}
      </div>
      <div className="hidden md:flex flex-wrap justify-start gap-3 items-center text-gray-500 max-w-[216px] ">
        <p>privacy terms</p>
        <p>copy rights</p>
        <p>@2025</p>
        <p>omar gad</p>
      </div>
    </div>
  );
};

export default Sidebar;
