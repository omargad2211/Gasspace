import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { useSelector } from "react-redux";
import Search from "../pages/search/components/Search";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.auth);

  return (
    <nav className="z-[9999] fixed w-full px-8  bg-white">
      <div className="w-full flex justify-between items-center gap-2">
        <Link to="/">
          <img src="\images\gasspace.png" alt="logo" className="h-20 w-auto" />
        </Link>
        <Search />
        <Link
          to={"/profile"}
          className="flex justify-center items-center gap-2 ml-2"
        >
          <img
            src={currentUser?.photoURL || "images/User-Profile-PNG-Clipart.png"}
            alt="profile"
            className="size-8 rounded-full"
          />
          <p className="text-xs md:text-base font-semibold text-nowrap">
            {currentUser?.displayName || "User Name"}
          </p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
