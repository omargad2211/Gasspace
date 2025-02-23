import React, { useState } from 'react'
import { useGetPostsQuery } from '../../../redux/postsApi';
import { useGetAllRepostsQuery } from '../../../redux/repostsApi';
import { useSelector } from 'react-redux';
import PostCard from '../../Home/components/PostCard';
import { BiRepost } from 'react-icons/bi';

const AllPosts = () => {
  const { currentUser } = useSelector((state) => state.auth);

      const { data: posts } = useGetPostsQuery();
      const userPosts = posts?.filter((post) => post?.uid === currentUser?.uid);
      const { data: reposts, error } = useGetAllRepostsQuery();
      const userReposts = reposts?.filter(
        (repost) => repost.userID === currentUser?.uid
      );

      //   console.log(userReposts);

      const repostPostIDs = userReposts?.map((repost) => repost.postID);

      // Filter posts that match the repostPostIDs
      const userRepostedPosts = posts?.filter((post) =>
        repostPostIDs?.includes(post.id)
      );

  // Combine and sort posts
  const allPosts = [
    ...(Array.isArray(userPosts) ? userPosts : []),
    ...(Array.isArray(userRepostedPosts) ? userRepostedPosts : []),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return (
    <div className="space-y-4 ">
      {/* Display all posts mixed with reposts */}
      {allPosts?.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet.</p>
      ) : (
        allPosts?.map((post) => (
          <div key={post.id}>
            {/* If it's a reposted post, display a "Reposted" header */}
            {userReposts?.some((repost) => repost.postID === post.id) && (
              <div className="flex items-center gap-1 ">
                <BiRepost className="text-gray-600 text-xl" />
                <h4 className="text-sm text-gray-600">You reposted</h4>
              </div>
            )}
            {/* Display the post */}
            <PostCard post={post} />
          </div>
        ))
      )}
    </div>
  );
}

export default AllPosts
