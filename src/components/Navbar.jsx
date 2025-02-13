import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="z-[9999] fixed w-full px-8  bg-white">
      <div className="w-full flex justify-between items-center gap-2">
        <Link to="/">
          <img
            src="public\images\gasspace.png"
            alt="logo"
            className="h-20 w-auto"
          />
        </Link>
        <label className="relative text-gray-200 w-1/2 ">
          <input
            className="border-[1px] w-full bg-transparent rounded-full outline-none ring-0 py-1 px-2 pl-10"
            type="search"
            placeholder="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </label>
        <Link className="flex justify-center items-center gap-2">
          <img
            src="public\images\User-Profile-PNG-Clipart.png"
            alt="profile"
            className="size-8 rounded-full"
          />
          <p className="text-xs md:text-base font-semibold text-nowrap">
            User Name
          </p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
