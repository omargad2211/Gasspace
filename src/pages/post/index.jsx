import React from "react";
import { useParams } from "react-router-dom";
import { useGetPostsQuery } from "../../redux/postsApi";
import PostCard from "../Home/components/PostCard";

const PostPage = () => {
  const { id } = useParams();
  console.log(id);

  const { data: posts, isLoading: isPostsLoading } = useGetPostsQuery();

  if (isPostsLoading) {
    return <p className="text-center text-gray-500 mt-10">Loading post...</p>; 
  }

  const postData = posts?.find((post) => post?.id === id);
  console.log(postData);

  return (
    <div className="min-h-screen bg-primary px-4 mx-auto pt-24 pl-[100px] ss:pl-[150px] md:px-[20%] pb-4">
      <h1 className="w-full bg-white p-4 font-semibold text-blue-800 text-lg">
        Post
      </h1>
      {postData ? (
        <PostCard post={postData} />
      ) : (
        <p className="text-center text-red-500 mt-10">Post not found!</p>
      )}
    </div>
  );
};

export default PostPage;
