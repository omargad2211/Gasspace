import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../../Home/components/PostCard";

const SavedPosts = () => {
  const savedPosts = useSelector((state) => state.saved.items);
  const dispatch = useDispatch();
//   console.log(savedPosts);
  return (
    <div className="space-y-4">
      {savedPosts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet.</p>
      ) : (
        savedPosts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} />
          </div>
        ))
      )}
    </div>
  );
};

export default SavedPosts;
