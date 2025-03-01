import React from "react";
import { useLocation } from "react-router-dom";
import PostCard from "../Home/components/PostCard";

const SearchPage = () => {
  const { state } = useLocation();
  console.log(state);

  return (
    <div className="min-h-screen bg-primary px-4 mx-auto pt-24 pl-[100px] ss:pl-[150px]  md:px-[20%] pb-4">
      {state?.SearchedPosts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default SearchPage;
