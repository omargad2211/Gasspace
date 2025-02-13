// import React from 'react'

import AddPost from "./components/AddPost";
import PostCard from "./components/PostCard";

const Home = () => {
  return (
    <div className="min-h-screen bg-primary px-4 mx-auto  pt-24 pl-28 md:pl-[240px] ">
      <AddPost />
      <PostCard />
    </div>
  );
};

export default Home;
