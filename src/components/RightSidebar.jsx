import { Link, NavLink, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { FaPeoplePulling } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firbase";
import { useGetNotificationsQuery } from "../redux/notificationsApi";
import { useGetUserFollowDataQuery } from "../redux/followersApi";
import { useGetAllRepostsQuery } from "../redux/repostsApi";
import { IoIosNotificationsOutline } from "react-icons/io";

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // console.log("User logged out");
      navigate("/register");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const {
    data: followData,
    isLoading: isFollowDataLoading,
    refetch: refetchFollowData,
  } = useGetUserFollowDataQuery(currentUser?.uid);

  const { data: reposts, error } = useGetAllRepostsQuery();
  const userReposts = reposts?.filter(
    (repost) => repost.userID === currentUser?.uid
  );

  // const { data: notifications } = useGetNotificationsQuery(currentUser?.uid);
  // const unreadCount = notifications?.filter((notif) => !notif.seen).length || 0;

  const navigation = [
    {
      title: "Feed",
      path: "/",
      icon: <AiOutlineHome />,
    },
    {
      title: "notifications",
      path: "notifications",
      icon: <IoIosNotificationsOutline />,
    },
    {
      title: "Profile",
      path: "profile",
      icon: <IoPersonOutline />,
    },
  ];

  return (
    <div className="bg-primary fixed left-0 top-20 md:top-24 flex flex-col justify-start items-start gap-4 px-2 h-screen w-1/5">
      {currentUser && (
        <div className="hidden md:block bg-white p-4 rounded-lg  w-full">
          <Link
            to={"/profile"}
            className="flex justify-start items-center gap-2"
          >
            <img
              src={
                currentUser?.photoURL || "images/User-Profile-PNG-Clipart.png"
              }
              alt="profile"
              className="size-8 rounded-full"
            />
            <div className="flex flex-col ">
              <p className="text-black  md:text-xs lg:text-sm font-semibold">
                {" "}
                {currentUser?.displayName || "User Name"}
              </p>
              <p className="text-gray-500 text-xs">@username</p>
            </div>
          </Link>
          <div className="flex justify-between items-center gap-1 pt-4 flex-wrap text-sm">
            <div className="text-center">
              <p> {followData?.followers?.length || 0}</p>
              <p className="text-xs">followers</p>
            </div>
            <div className="text-center">
              <p> {followData?.following?.length || 0}</p>
              <p className="text-xs">following</p>
            </div>
            <div className="text-center">
              <p>{userReposts?.length}</p>
              <p className="text-xs">posts</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white h-full md:h-1/2 flex flex-col items-start justify-around px-4 md:px-2 gap-4 md:w-full rounded-lg">
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
        {currentUser ? (
          <button
            className="text-gray-500 flex justify-center items-center gap-2 w-full text-xs md:text-lg"
            onClick={() => {
              handleLogout();
              // setMenuOpen(false); // Close menu after logout
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              height="1em"
              width="1em"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M5 11h8v2H5v3l-5-4 5-4v3zm-1 7h2.708a8 8 0 100-12H4a9.985 9.985 0 018-4c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.985 9.985 0 01-8-4z" />
            </svg>
            Logout
          </button>
        ) : (
          <Link
            className="text-gray-500 flex justify-center items-center gap-2 w-full"
            to={"/login"}
          >
            Login
          </Link>
        )}
        <div></div>
        {/* <p className="text-black">ahmed</p> */}
      </div>
      <div className="hidden md:flex flex-wrap justify-start gap-2 items-center text-gray-500 w-full text-xs lg:text-base lg:gap-3 ">
        <p>privacy terms</p>
        <p>copy rights</p>
        <p>@2025</p>
        <p>omar gad</p>
      </div>
    </div>
  );
};

export default Sidebar;


// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { AiOutlineHome } from "react-icons/ai";
// import { FaPeoplePulling } from "react-icons/fa6";
// import { IoPersonOutline } from "react-icons/io5";
// import { useSelector } from "react-redux";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase/firbase";
// import { useGetNotificationsQuery } from "../redux/notificationsApi";
// import { useGetUserFollowDataQuery } from "../redux/followersApi";
// import { useGetAllRepostsQuery } from "../redux/repostsApi";
// import { useState } from "react";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const { currentUser } = useSelector((state) => state.auth);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       // console.log("User logged out");
//       navigate("/register");
//     } catch (error) {
//       console.error("Logout Error: ", error);
//     }
//   };

//   const {
//     data: followData,
//     isLoading: isFollowDataLoading,
//     refetch: refetchFollowData,
//   } = useGetUserFollowDataQuery(currentUser?.uid);

//   const { data: reposts, error } = useGetAllRepostsQuery();
//   const userReposts = reposts?.filter(
//     (repost) => repost.userID === currentUser?.uid
//   );

//   // const { data: notifications } = useGetNotificationsQuery(currentUser?.uid);
//   // const unreadCount = notifications?.filter((notif) => !notif.seen).length || 0;

//   const navigation = [
//     {
//       title: "Feed",
//       path: "/",
//       icon: <AiOutlineHome />,
//     },
//     {
//       title: "notifications",
//       path: "notifications",
//       icon: <FaPeoplePulling />,
//     },
//     {
//       title: "Profile",
//       path: "profile",
//       icon: <IoPersonOutline />,
//     },
//   ];

//   return (
//     <div className="bg-primary fixed left-0 top-20 md:top-24 flex flex-col justify-start items-start gap-4 px-2 h-screen w-1/5">
//       {currentUser && (
//         <div className="hidden md:block bg-white p-4 rounded-lg  w-full">
//           <Link
//             to={"/profile"}
//             className="flex justify-start items-center gap-2"
//           >
//             <img
//               src={
//                 currentUser?.photoURL || "images/User-Profile-PNG-Clipart.png"
//               }
//               alt="profile"
//               className="size-8 rounded-full"
//             />
//             <div className="flex flex-col ">
//               <p className="text-black  md:text-xs lg:text-sm font-semibold">
//                 {" "}
//                 {currentUser?.displayName || "User Name"}
//               </p>
//               <p className="text-gray-500 text-xs">@username</p>
//             </div>
//           </Link>
//           <div className="flex justify-between items-center gap-1 pt-4 flex-wrap text-sm">
//             <div className="text-center">
//               <p> {followData?.followers?.length || 0}</p>
//               <p className="text-xs">followers</p>
//             </div>
//             <div className="text-center">
//               <p> {followData?.following?.length || 0}</p>
//               <p className="text-xs">following</p>
//             </div>
//             <div className="text-center">
//               <p>{userReposts?.length}</p>
//               <p className="text-xs">posts</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="bg-white h-full md:h-1/2 flex flex-col items-start justify-around px-4 md:px-2 gap-4 md:w-full rounded-lg">
//         {navigation.map((nav, i) => (
//           <NavLink
//             key={i}
//             to={nav.path}
//             className="text-gray-500 flex justify-center items-center gap-2 w-full"
//           >
//             <div className="text-lg md:text-2xl">{nav.icon}</div>
//             <p className="text-base md:text-lg text-nowrap hidden md:block ">
//               {nav.title}
//             </p>
//           </NavLink>
//         ))}
//         {currentUser ? (
//           <button
//             className="text-gray-500 flex justify-center items-center gap-2 w-full text-xs md:text-lg"
//             onClick={() => setIsModalOpen(true)}
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="currentColor"
//               height="1em"
//               width="1em"
//             >
//               <path fill="none" d="M0 0h24v24H0z" />
//               <path d="M5 11h8v2H5v3l-5-4 5-4v3zm-1 7h2.708a8 8 0 100-12H4a9.985 9.985 0 018-4c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.985 9.985 0 01-8-4z" />
//             </svg>
//             Logout
//           </button>
//         ) : (
//           <Link
//             className="text-gray-500 flex justify-center items-center gap-2 w-full"
//             to={"/login"}
//           >
//             Login
//           </Link>
//         )}
//         <div></div>
//         {/* <p className="text-black">ahmed</p> */}
//       </div>
//       <div className="hidden md:flex flex-wrap justify-start gap-2 items-center text-gray-500 w-full text-xs lg:text-base lg:gap-3 ">
//         <p>privacy terms</p>
//         <p>copy rights</p>
//         <p>@2025</p>
//         <p>omar gad</p>
//       </div>
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">
//               Do you want to log out?
//             </h2>
//             <div className="flex justify-between">
//               <button
//                 className="bg-[#D9F8FF] text-blue-700 px-4 py-2 rounded-md hover:bg-[#a9efff]"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//               <button
//                 className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;
