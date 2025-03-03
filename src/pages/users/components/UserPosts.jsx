import React from "react";
import PostCard from "../../Home/components/PostCard";
import { useGetPostsQuery } from "../../../redux/postsApi";
import { useParams } from "react-router-dom";
import { useGetAllRepostsQuery } from "../../../redux/repostsApi";
import { BiRepost } from "react-icons/bi";
import { useGetAllUsersQuery } from "../../../redux/authApi";
import PostCardSkeleton from "../../Skeletons/PostCardSkeleton";

const UserPosts = () => {
  const { id } = useParams();
  const { data: users, isLoading } = useGetAllUsersQuery();
  const UserData = users?.find((user) => user?.id === id);

  const { data: posts, isLoading: isPostsLoading } = useGetPostsQuery();
  const userPosts = posts?.filter((post) => post.uid === id);

  const {
    data: reposts,
    error,
    isLoading: isrePostsLoading,
  } = useGetAllRepostsQuery();
  const userReposts = reposts?.filter((repost) => repost.userID === id);

  //   console.log(userPosts);

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
  //   console.log(allPosts);

  if (isPostsLoading || isrePostsLoading) {
    return [...Array(4)].map((_, index) => <PostCardSkeleton key={index} />);
  }
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
                <h4 className="text-sm text-gray-600">
                  {UserData?.displayName} reposted
                </h4>
              </div>
            )}
            {/* Display the post */}
            <PostCard post={post} />
          </div>
        ))
      )}
    </div>
  );
};

export default UserPosts;
