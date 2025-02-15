import { AiOutlineMessage } from "react-icons/ai";
import { FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import { formatTimestamp } from "../../../Helpers/formatTimestamp";
import {
  useAddCommentMutation,
  useGetCommentsQuery,
} from "../../../redux/commentsApi";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useAddLikeMutation,
  useGetLikesQuery,
  useRemoveLikeMutation,
} from "../../../redux/likesApi";

const PostCard = ({ post }) => {
  console.log(post);
  const { currentUser } = useSelector((state) => state.auth);

  // Fetch comments related to this post
  const { data: comments, isLoading } = useGetCommentsQuery(post.id);

  // Mutation for adding a comment
  const [addComment] = useAddCommentMutation();

  // State for new comment input
  const [commentText, setCommentText] = useState("");

  // State to toggle comment section visibility
  const [showComments, setShowComments] = useState(false);

  // Function to handle comment submission
  const handleAddComment = async () => {
    if (commentText.trim() === "") return;
    await addComment({
      comment: commentText,
      postID: post?.id,
      userID: post?.uid,
      photoURL: currentUser.photoURL,
      displayName: currentUser.displayName,
    });
    setCommentText(""); // Clear input after adding comment
  };

  const { data: likes = [] } = useGetLikesQuery(post.id);

  // Mutations for adding and removing likes
  const [addLike] = useAddLikeMutation();
  const [removeLike] = useRemoveLikeMutation();
  const [showLikes, setShowLikes] = useState(false);
  const isLikedByUser = likes.some((like) => like.userID === currentUser?.uid);

  const handleLike = async () => {
    if (!currentUser) return;
    if (isLikedByUser) {
      await removeLike({ postID: post.id, userID: currentUser.uid });
    } else {
      await addLike({
        postID: post.id,
        userID: currentUser.uid,
        photoURL: currentUser.photoURL,
        displayName: currentUser.displayName,
      });
    }
  };
  return (
    <div className="bg-white p-2 mt-2 shadow-md rounded-lg">
      {/* Post Header */}
      <div className="flex justify-start items-center gap-2">
        <img
          src={post.photoURL}
          alt="profile"
          className="size-8 rounded-full"
        />
        <div className="flex flex-col">
          <p className="text-black text-sm font-semibold">{post.displayName}</p>
          <p className="text-gray-500 text-xs">
            {formatTimestamp(post.timestamp)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-500 pt-3 text-sm px-4">{post.post}</p>
      {post.img || post.image ? (
        <img
          src={post.img || post.image}
          alt="Post content"
          className="w-full rounded-lg mt-4"
        />
      ) : null}

      {/* Post Actions */}
      <div className="w-full border-t mt-3 p-2 text-gray-500 flex justify-between items-center gap-4 text-sm md:text-base">
        <div className="flex justify-start items-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center justify-center gap-1"
          >
            {isLikedByUser ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
          </button>
          <p
            className="cursor-pointer hover:underline"
            onClick={() => setShowLikes((prev) => !prev)}
          >
            {likes.length} Likes
          </p>

          {/* Toggle Comments Section */}
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center justify-center gap-1"
          >
            <AiOutlineMessage />
            <p>{comments?.length} comments</p>
          </button>

          {/* Share */}
          <div className="flex items-center justify-center gap-1">
            <RiShareForwardLine />
            <p>32 reposts</p>
          </div>
        </div>
        <FaRegBookmark />
      </div>

      {/* Liked Users List */}
      {showLikes && likes.length > 0 && (
        <div className="bg-gray-100 p-2 rounded mt-2 text-sm">
          <p className="font-semibold">Liked by:</p>
          <ul>
            {likes.map((like) => (
              <li key={like.id} className="flex items-center gap-2 mt-1">
                <img
                  src={like.photoURL}
                  alt="user"
                  className="size-6 rounded-full"
                />
                <p>{like.displayName}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 px-4">
          <h3 className="font-semibold text-gray-700">Comments</h3>
          {isLoading ? (
            <p className="text-gray-500">Loading comments...</p>
          ) : comments?.length > 0 ? (
            <ul className="mt-2">
              {comments.map((comment) => (
                <li key={comment.id} className="border-b py-2 text-sm">
                  <strong className="text-gray-800">
                    {comment.displayName}:
                  </strong>{" "}
                  {comment.comment}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              No comments yet. Be the first to comment!
            </p>
          )}

          {/* Add Comment Section */}
          <div className="mt-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
