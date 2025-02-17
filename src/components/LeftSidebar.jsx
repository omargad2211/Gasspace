import React from "react";
import { useGetAllUsersQuery } from "../redux/authApi";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const { data: users, error, isLoading } = useGetAllUsersQuery();

  return (
    <div className="bg-primary fixed right-0 top-20 md:top-24 hidden md:flex flex-col justify-start items-start gap-4 px-2  h-screen w-1/5">
      <p className="text-base font-semibold">People you may know </p>
      <div className="bg-white h-full md:h-1/2 flex flex-col items-start justify-around px-2 gap-8 md:w-full rounded-lg overflow-y-auto overflow-x-hidden scrollbar-hide pt-3">
        {users
          ?.filter((user) => user.displayName && user.photoURL) // Filter valid users
          .map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="flex justify-start items-center gap-2 text-gray-600 hover:bg-[#D9F8FF] px-2 py-1 w-full rounded-xl hover:text-blue-700"
            >
              <img
                src={user.photoURL}
                alt="profile"
                className="size-8 rounded-full"
              />
              <p className="text-sm font-normal  text-wrap ">
                {user.displayName}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
