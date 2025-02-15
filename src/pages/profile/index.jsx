import { useSelector } from "react-redux";
import { useGetPostsQuery } from "../../redux/postsApi";
import PostCard from "../Home/components/PostCard";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { data: posts, error, isLoading } = useGetPostsQuery();
  const userPosts = posts?.filter((post) => post?.uid === currentUser.uid);
  console.log(posts);
  console.log(currentUser);

  return (
    <div className="min-h-screen bg-primary px-4 mx-auto pt-24 pl-[70px] md:pl-[240px]">
      <main className="flex-grow w-full ">
        <header className="flex justify-between items-center bg-white p-4 border-b">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button className="btn btn-primary bg-orange-500 border-orange-700 hover:bg-teal-600 text-white btn-sm">
            Edit Profile
          </button>
        </header>

        <section className="p-4">
          {/* Profile Header */}
          <div className="relative">
            <img
              src="https://i.pinimg.com/originals/f8/79/d2/f879d28c3b4b30cb08c4e0cb191baa23.jpg"
              alt="Cover Photo"
              className="w-full h-48 object-cover"
            />
            <div className="absolute -bottom-16 left-4">
              <img
                src={`${currentUser?.photoURL}`}
                // `url(${currentUser.photoURL})`
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-20 mb-4 px-4">
            <h1 className="text-2xl font-bold">{`${currentUser?.displayName}`}</h1>
            <p className="text-gray-600">@{`${currentUser?.displayName}`}</p>
            <p className="mt-2">
              Software Engineer | Tech Enthusiast | Open Source Contributor
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-gray-600">Location: Dokki, Cairo.</span>
              <span className="text-gray-600">Joined: July 2024</span>
            </div>
            <div className="flex space-x-4 mt-4">
              <div>
                <span className="font-bold">512</span> Following
              </div>
              <div>
                <span className="font-bold">2.3K</span> Followers
              </div>
            </div>
          </div>

          {/* Tweet Tabs */}
          <div className="border-b mb-4">
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
