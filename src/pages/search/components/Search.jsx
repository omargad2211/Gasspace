import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useGetPostsQuery } from "../../../redux/postsApi";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: posts } = useGetPostsQuery();
  const navigate = useNavigate();

  const SearchedPosts = posts?.filter((post) => {
    const postLower = post?.post?.toLowerCase();
    return postLower?.includes(searchQuery.toLowerCase());
  });
  console.log(SearchedPosts);
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/search", { state: { SearchedPosts } });
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-1/2">
      <input
        className="border-[1px] w-full bg-transparent rounded-full outline-none ring-0 py-1 px-2 pl-10"
        type="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <IoIosSearch
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
        onClick={handleSearch}
      />
    </form>
  );
};

export default Search;
