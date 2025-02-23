import React from "react";
import { useSelector } from "react-redux";
import { useGetUserLikesQuery } from "../../../redux/likesApi";
import { useGetPostsQuery } from "../../../redux/postsApi";
import PostCard from "../../Home/components/PostCard";

const AllLikes = () => {
  const { currentUser } = useSelector((state) => state.auth);

  // Fetch all posts
  const { data: posts = [] } = useGetPostsQuery();

  // Fetch user likes
  const { data: userLikes = [] } = useGetUserLikesQuery(currentUser?.uid);

  const likedPosts = posts
    .filter((post) => userLikes.some((like) => like.postID === post.id))
    .sort((a, b) => {
      const timestampA =
        userLikes.find((like) => like.postID === a.id)?.timestamp || 0;
      const timestampB =
        userLikes.find((like) => like.postID === b.id)?.timestamp || 0;
      return timestampB - timestampA;
    });

//   console.log("Liked Posts:", likedPosts);

  return (
    <div className="space-y-4">
      {likedPosts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet.</p>
      ) : (
        likedPosts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} />
          </div>
        ))
      )}
    </div>
  );
};

export default AllLikes;
