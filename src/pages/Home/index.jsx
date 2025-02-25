import { useGetPostsQuery } from "../../redux/postsApi";
import PostCardSkeleton from "../Skeletons/PostCardSkeleton";
import AddPost from "./components/AddPost";
import PostCard from "./components/PostCard";

const Home = () => {
  const { data: posts, error, isLoading } = useGetPostsQuery();

  if (isLoading) {
    return [...Array(4)].map((_, index) => <PostCardSkeleton key={index} />);
  }
  return (
    <div className="min-h-screen bg-primary px-4 mx-auto pt-24 pl-[100px] ss:pl-[150px]  md:px-[20%]">
      <AddPost />
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;
