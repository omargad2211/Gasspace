import { FaEdit } from "react-icons/fa";
import PostCard from "../Home/components/PostCard";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useGetAllUsersQuery } from "../../redux/authApi";
import { useGetPostsQuery } from "../../redux/postsApi";
import {
  useFollowUserMutation,
  useGetUserFollowDataQuery,
  useUnfollowUserMutation,
} from "../../redux/followersApi";
import { useSelector } from "react-redux";
import { useCreateNotificationMutation } from "../../redux/notificationsApi";

const UserProfile = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.auth);

  const { data: users, isLoading: isUsersLoading } = useGetAllUsersQuery();
  const [createNotification] = useCreateNotificationMutation();

  const UserData = users?.find((user) => user?.id === id);

  const {
    data: followData,
    isLoading: isFollowDataLoading,
    refetch: refetchFollowData,
  } = useGetUserFollowDataQuery(UserData?.uid);
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] =
    useUnfollowUserMutation();

  const isFollowingUser = followData?.followers?.includes(currentUser?.uid);

  const handleFollowToggle = async () => {
    if (isFollowingUser) {
      await unfollowUser({
        currentUserID: currentUser?.uid,
        targetUserID: UserData?.uid,
      });
    } else {
      await followUser({
        currentUserID: currentUser?.uid,
        targetUserID: UserData?.uid,
      });
      await createNotification({
        toUserId: UserData?.uid,
        fromUserId: currentUser?.uid,
        type: "follow",
      });
    }
    refetchFollowData(); // Refetch follow data after the operation
  };

  if (isUsersLoading || isFollowDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-primary px-4 mx-auto pt-24 pl-[100px] ss:pl-[150px] md:px-[20%]">
      <main className="flex-grow w-full">
        <header className="flex justify-between items-center bg-white p-4 border-b">
          <h2 className="text-xl font-semibold">Profile</h2>
        </header>

        <section className="py-4">
          <div className="relative">
            <img
              src={UserData?.headerImage}
              alt="Cover"
              className="w-full h-48 object-cover"
            />
            <div className="absolute -bottom-16 left-4">
              <img
                src={UserData?.photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            </div>
          </div>

          {/* Follow/Unfollow Button */}
          {currentUser?.uid !== UserData?.uid && (
            <button
              onClick={handleFollowToggle}
              disabled={isFollowing || isUnfollowing}
              className={`absolute right-12 md:right-[25%] z-40 px-4 py-1 mt-2 shadow-md rounded-full text-center font-semibold text-base md:text-lg ${
                isFollowingUser
                  ? "bg-[#ffd9d9] text-red-700 px-4 hover:bg-[#ffa9a9]"
                  : "bg-[#D9F8FF] text-blue-700 px-4 hover:bg-[#a9efff]"
              }`}
            >
              {isFollowingUser ? "Unfollow" : "Follow"}
            </button>
          )}

          <div className="mt-20 mb-2 px-4">
            <h1 className="text-2xl font-bold">{UserData?.displayName}</h1>
            <p className="text-gray-600">@{UserData?.username}</p>
            <p className="mt-2">{UserData?.bioText}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-gray-600">
                Location: {UserData?.location}
              </span>
              <span className="text-gray-600">Joined: Month Year</span>
            </div>
          </div>

          {/* Followers & Following Count */}
          <div className="flex space-x-4 px-4">
            <div>
              <span className="font-bold">
                {followData?.following?.length || 0}
              </span>{" "}
              Following
            </div>
            <div>
              <span className="font-bold">
                {followData?.followers?.length || 0}
              </span>{" "}
              Followers
            </div>
          </div>

          <div className="border-b my-4">
            <ul className="flex justify-around text-center text-sm font-medium">
              <NavLink
                to={`/profile/${UserData?.uid}/posts`}
                className="flex-1 hover:bg-gray-200 cursor-pointer p-2"
              >
                Posts
              </NavLink>
              <NavLink
                to={`/profile/${UserData?.uid}/likes`}
                className="flex-1 hover:bg-gray-200 cursor-pointer p-2"
              >
                Likes
              </NavLink>
            </ul>
          </div>

          {/* User Posts */}
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
