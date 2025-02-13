import { useGetPostsQuery } from "../../redux/postsApi";
import AddPost from "./components/AddPost";
import PostCard from "./components/PostCard";

const Home = () => {
  const { data: posts, error, isLoading } = useGetPostsQuery();

  console.log(posts);

  return (
    <div className="min-h-screen bg-primary px-4 mx-auto pt-24 pl-28 md:pl-[240px]">
      <AddPost />
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;
