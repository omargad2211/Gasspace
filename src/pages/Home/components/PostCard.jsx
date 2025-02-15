import { AiOutlineMessage } from "react-icons/ai";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import { formatTimestamp } from "../../../Helpers/formatTimestamp";

const PostCard = ({ post }) => {
  // console.log(post);
  return (
    <div className="bg-white p-2 mt-2">
      <div className="flex justify-start items-center gap-2">
        <img
          src={post.photoURL}
          alt="profile"
          className="size-8 rounded-full"
        />
        <div className="flex flex-col ">
          <p className="text-black text-sm font-semibold">{post.displayName}</p>
          <p className="text-gray-500 text-xs">
            {formatTimestamp(post.timestamp)}
          </p>
        </div>
      </div>
      <p className="text-gray-500 pt-3 text-sm px-4">{post.post}</p>
      <img
        src={post.img || post.image}
        alt=""
        className="w-full rounded-lg mt-4"
      />
      <div className="w-full border-t boder-2 mt-3 p-2 text-gray-500  flex justify-between items-center gap-4 text-sm md:text-base">
        <div className=" flex justify-start items-center gap-4">
          <div className="flex items-center justify-center gap-1">
            <FaRegHeart />
            <p>32 Likes</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <AiOutlineMessage />
            <p>3 comments</p>
          </div>{" "}
          <div className="flex items-center justify-center gap-1">
            <RiShareForwardLine />
            <p>32 reposts</p>
          </div>
        </div>
        <FaRegBookmark className="" />
      </div>
    </div>
  );
};

export default PostCard;
