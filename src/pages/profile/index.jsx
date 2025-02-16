import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "../../redux/authApi";
import { updateUser } from "../../redux/authSlice";
import { FaEdit } from "react-icons/fa";
import { useGetPostsQuery } from "../../redux/postsApi";
import PostCard from "../Home/components/PostCard";
import { formatMonthYear } from "../../Helpers/formatDate";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const { data: posts, error } = useGetPostsQuery();
  const userPosts = posts?.filter((post) => post?.uid === currentUser?.uid);
//   console.log(currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: currentUser?.displayName || "",
      bioText: currentUser?.bioText || "",
      location: currentUser?.location || "",
    },
  });

  const handleUpdate = async (data) => {
    const { displayName, bioText, location } = data;
    const img = data.profileImage?.[0];
    const headerImage = data.headerImage?.[0];

    const result = await updateProfile({
      displayName,
      img,
      bioText,
      headerImage,
      location,
    });

    if (!result.error) {
      dispatch(updateUser(result.data));
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary px-4 mx-auto pt-24 pl-[100px] ss:pl-[150px]  md:px-[20%]">
      <main className="flex-grow w-full">
        <header className="flex justify-between items-center bg-white p-4 border-b">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="py-2 px-2 md:px-4 bg-[#D9F8FF] text-blue-700 text-sm md:text-base font-semibold rounded-xl border-orange-700 hover:bg-teal-600 hover:text-white text-nowrap flex items-center"
          >
            <FaEdit className="mr-1" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </header>

        <section className="py-4">
          <div className="relative">
            <img
              src={
                currentUser?.headerImage ||
                "https://via.placeholder.com/800x200"
              }
              alt="Cover"
              className="w-full h-48 object-cover"
            />
            <div className="absolute -bottom-16 left-4">
              <img
                src={currentUser?.photoURL || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            </div>
          </div>

          {!isEditing ? (
            <div className="mt-20 mb-2 px-4">
              <h1 className="text-2xl font-bold">{currentUser?.displayName}</h1>
              <p className="text-gray-600">@{currentUser?.displayName}</p>
              <p className="mt-2">{currentUser?.bioText}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-gray-600">
                  Location: {currentUser?.location || "Not set"}
                </span>
                <span className="text-gray-600">
                  Joined: {formatMonthYear(currentUser?.creationTime)}
                </span>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(handleUpdate)}
              className="mt-20 mb-4 px-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  {...register("displayName", { required: "Name is required" })}
                  className="input input-bordered w-full"
                />
                {errors.displayName && (
                  <p className="text-red-500 text-xs">
                    {errors.displayName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  {...register("bioText")}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  {...register("location")}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("profileImage")}
                  className="file-input file-input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Header Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("headerImage")}
                  className="file-input file-input-bordered w-full"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </button>
            </form>
          )}
          <div className="flex space-x-4 px-4">
            <div>
              <span className="font-bold">512</span> Following
            </div>
            <div>
              <span className="font-bold">2.3K</span> Followers
            </div>
          </div>
          <div className="border-b my-4 ">
            <ul className="flex justify-around text-center text-sm font-medium">
              <li className="flex-1 hover:bg-gray-200 cursor-pointer p-2">
                <span>Tweets</span>
              </li>
              <li className="flex-1 hover:bg-gray-200 cursor-pointer p-2">
                <span>Tweets & Replies</span>
              </li>
              <li className="flex-1 hover:bg-gray-200 cursor-pointer p-2">
                <span>Media</span>
              </li>
              <li className="flex-1 hover:bg-gray-200 cursor-pointer p-2">
                <span>Likes</span>
              </li>
            </ul>
          </div>

          {/* Tweets */}
          <div className="space-y-4">
            <div className="space-y-4">
              {userPosts?.length === 0 ? (
                <p className="text-center text-gray-500">No posts yet.</p>
              ) : (
                userPosts?.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
