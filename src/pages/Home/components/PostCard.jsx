import { AiOutlineMessage } from "react-icons/ai";
import { FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import { BiRepost } from "react-icons/bi";
import { formatTimestamp } from "../../../Helpers/formatTimestamp";
import { useState } from "react";
import { useSelector } from "react-redux";

import {
  useAddCommentMutation,
  useGetCommentsQuery,
} from "../../../redux/commentsApi";

import {
  useAddLikeMutation,
  useGetLikesQuery,
  useRemoveLikeMutation,
} from "../../../redux/likesApi";

import {
  useAddRepostMutation,
  useGetRepostsQuery,
  useRemoveRepostMutation,
} from "../../../redux/repostsApi"; // Import repost mutations
import { useCreateNotificationMutation } from "../../../redux/notificationsApi";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  // console.log(post.id);
  const { currentUser } = useSelector((state) => state.auth);
  const [createNotification] = useCreateNotificationMutation();

  // Fetch comments
  const { data: comments, isLoading } = useGetCommentsQuery(post?.id);
  const [addComment] = useAddCommentMutation();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  // handle add comment
  const handleAddComment = async () => {
    if (commentText.trim() === "" || !post?.id) return; // Ensure post.id is available

    await addComment({
      comment: commentText,
      postID: post.id, // Make sure it's `post.id`
      userID: currentUser?.uid,
      photoURL: currentUser?.photoURL,
      displayName: currentUser?.displayName,
    });

    setCommentText("");

    // Ensure the post.id is passed correctly
    await createNotification({
      toUserId: post.uid,
      fromUserId: currentUser?.uid,
      postId: post.id,
      type: "comment",
      photoURL: currentUser?.photoURL,
      displayName: currentUser?.displayName,
    });
  };

  // Fetch likes
  const { data: likes = [] } = useGetLikesQuery(post?.id);
  const [addLike] = useAddLikeMutation();
  const [removeLike] = useRemoveLikeMutation();
  const [showLikes, setShowLikes] = useState(false);
  const isLikedByUser = likes.some((like) => like.userID === currentUser?.uid);

  // Handle Like
  const handleLike = async () => {
    if (!currentUser || !post?.id) return;

    if (isLikedByUser) {
      await removeLike({ postID: post.id, userID: currentUser.uid });
    } else {
      await addLike({
        postID: post.id,
        userID: currentUser.uid,
        photoURL: currentUser.photoURL,
        displayName: currentUser.displayName,
      });

      await createNotification({
        toUserId: post?.uid,
        fromUserId: currentUser?.uid,
        postId: post.id, // Ensure it's `postId`, not `postID`
        type: "like",
        photoURL: currentUser.photoURL,
        displayName: currentUser.displayName,
      });
    }
  };

  // Fetch reposts
  const { data: reposts = [] } = useGetRepostsQuery(post?.id);
  const [addRepost] = useAddRepostMutation();
  const [removeRepost] = useRemoveRepostMutation();
  const isRepostedByUser = reposts.some(
    (repost) => repost.userID === currentUser?.uid
  );

  // Handle Repost
  const handleRepost = async () => {
    if (!currentUser || !post?.id) return;
    if (isRepostedByUser) {
      await removeRepost({ postID: post.id, userID: currentUser.uid });
    } else {
      await addRepost({
        postID: post.id,
        userID: currentUser.uid,
        photoURL: currentUser.photoURL,
        displayName: currentUser.displayName,
      });
      await createNotification({
        toUserId: post?.uid,
        fromUserId: currentUser?.uid,
        postId: post?.id,
        type: "repost",
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
          src={post?.photoURL}
          alt="profile"
          className="size-8 rounded-full"
        />
        <div className="flex flex-col">
          <p className="text-black text-sm font-semibold">{post?.displayName}</p>
          <p className="text-gray-500 text-xs">
            {formatTimestamp(post?.timestamp)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <Link to={`/post/${post?.id}`}>
        <p className="text-gray-500 pt-3 text-sm px-4">{post?.post}</p>
        {post?.img || post?.image ? (
          <img
            src={post?.img || post?.image}
            alt="Post content"
            className="w-full rounded-lg mt-4"
          />
        ) : null}
      </Link>
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

          {/* Repost Button */}
          <button
            onClick={handleRepost}
            className={`flex items-center justify-center gap-1 ${
              isRepostedByUser ? "text-blue-700" : ""
            }`}
          >
            <BiRepost className="text-xl" />
            <p>{reposts.length} reposts</p>
          </button>
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
                <li
                  key={comment.id}
                  className="border-b py-2 text-sm flex flex-col items-start gap-2 "
                >
                  <div className="flex items-end gap-1">
                    <img
                      src={
                        comment?.photoURL ||
                        "images/User-Profile-PNG-Clipart.png"
                      }
                      alt="profile"
                      className="size-8 rounded-full"
                    />
                    <p className="text-xs md:text-base font-semibold text-gray-600 text-nowrap">
                      {comment?.displayName}
                    </p>
                  </div>
                  <p className="px-8">{comment.comment}</p>
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
