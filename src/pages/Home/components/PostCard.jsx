import { AiOutlineMessage } from "react-icons/ai";
import { FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import { BiRepost } from "react-icons/bi";
import { PiDotsSix } from "react-icons/pi";
import { VscEdit } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";

import { formatTimestamp } from "../../../Helpers/formatTimestamp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import {
  useDeletePostMutation,
  useEditPostMutation,
} from "../../../redux/postsApi";
import { addToWishlist, removeFromWishlist } from "../../../redux/savedSlice";
import { useGetAllUsersQuery } from "../../../redux/authApi";

const PostCard = ({ post }) => {
  // console.log(post);
  const { currentUser } = useSelector((state) => state.auth);
  const [createNotification] = useCreateNotificationMutation();
  const [openModal, setOpenModal] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [newPostText, setNewPostText] = useState(post?.post || "");
  const dispatch = useDispatch();

  // Fetch comments
  const { data: comments, isLoading } = useGetCommentsQuery(post?.id);
  // console.log(comments);
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

  const originalPoster = post?.uid === currentUser?.uid;
  // console.log(originalPoster);

  const toggleModal = () => {
    setOpenModal(!openModal);
    // console.log(openModal);
  };

  const [editPost] = useEditPostMutation();

  const handleEditPost = async () => {
    if (!newPostText.trim()) return;
    await editPost({ postId: post.id, updatedData: { post: newPostText } });
    setEditMode(false);
    toggleModal();
  };

  const [deletePost] = useDeletePostMutation();

  const handleDeletePost = async () => {
    await deletePost(post.id);
  };

  const saved = useSelector((state) => state.saved.items);
  const isSelected = saved?.some((item) => item.id === post?.id);

  const handleToggleWishlist = () => {
    if (isSelected) {
      dispatch(removeFromWishlist({ id: post?.id }));
    } else {
      dispatch(
        addToWishlist({
          id: post?.id,
          uid: post?.uid,
          photoURL: post?.photoURL,
          displayName: post?.displayName,
          image: post?.image,
          post: post?.post,
          timestamp: post?.timestamp,
          isSelected: true,
        })
      );
    }
  };

  // get post user
  const { data: users, error } = useGetAllUsersQuery();
  const postUser = users?.find((user) => user?.uid === post?.uid);
  // console.log(postUser);
  return (
    <div className="bg-white p-2 mt-2 shadow-md rounded-lg relative ">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <Link
          to={`/profile/${post?.uid}`}
          className="flex justify-start items-center gap-2"
        >
          <img
            src={postUser?.photoURL}
            alt="profile"
            className="size-8 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-black text-sm font-semibold">
              {postUser?.displayName}
            </p>
            <p className="text-gray-500 text-xs">
              {formatTimestamp(post?.timestamp)}
            </p>
          </div>
        </Link>

        {/* post edit  */}
        {originalPoster && (
          <button onClick={toggleModal}>
            <PiDotsSix />
          </button>
        )}
      </div>
      {/* edit modal  */}
      {openModal && (
        <div className="absolute top-6 right-2 bg-white rounded-lg shadow-md shadow-gray-300 p-2 flex flex-col gap-2 hover:bg- ">
          <button
            onClick={() => {
              setEditMode(true);
              toggleModal();
            }}
            className="flex items-center justify-start gap-1 text-blue-800 hover:bg-[#D9F8FF] p-1 rounded-lg"
          >
            <VscEdit />
            <span>edit</span>
          </button>
          <button
            onClick={handleDeletePost}
            className="flex items-center justify-start gap-1 text-red-800 hover:bg-[#ffd9d9] p-1 rounded-lg"
          >
            <MdDeleteOutline />
            <span>delete</span>
          </button>
        </div>
      )}
      {editMode && (
        <div className="p-2">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditPost}
              className="bg-[#D9F8FF] hover:bg-[#b9f2ff] text-blue-800 px-8 py-1 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400/80 hover:bg-gray-400 text-white px-8 py-1 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Post Content */}
      {!editMode && (
        <Link to={`/post/${post?.id}`}>
          <p className="text-gray-800 font-semibold pt-3 text-sm px-4">
            {post?.post}
          </p>
          {post?.img || post?.image ? (
            <img
              src={post?.img || post?.image}
              alt="Post content"
              className="w-full rounded-lg mt-4"
            />
          ) : null}
        </Link>
      )}
      {/* Post Actions */}
      <div className="w-full border-t mt-3 p-2 text-gray-500 flex justify-between items-center gap-4 text-sm md:text-base">
        <div className="flex justify-around items-center w-full gap-2">
          {/* Like Button */}
          <div className="flex items-center justify-center gap-1">
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
            <Link
              to={`/post/${post?.id}`}
              className="cursor-pointer hover:underline flex items-center gap-1 "
              onClick={() => setShowLikes((prev) => !prev)}
            >
              {likes.length} <span className="hidden ss:block">Likes</span>
            </Link>
          </div>

          {/* Toggle Comments Section */}
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center justify-center gap-1"
          >
            <AiOutlineMessage />
            <Link
              className="cursor-pointer hover:underline flex items-center gap-1 "
              to={`/post/${post?.id}`}
            >
              {comments?.length}{" "}
              <span className="hidden ss:block ">comments</span>
            </Link>
          </button>

          {/* Repost Button */}
          <button
            onClick={handleRepost}
            className={`flex items-center justify-center gap-1 ${
              isRepostedByUser ? "text-blue-700" : ""
            }`}
          >
            <BiRepost className="text-xl" />
            <p className="flex gap-1">
              {reposts.length} <span className="hidden ss:block">reposts</span>{" "}
            </p>
          </button>
        </div>
        {/* saved button  */}
        <button
          onClick={() => handleToggleWishlist()}
          className={`${isSelected ? "text-blue-800" : ""} `}
        >
          <FaRegBookmark />
        </button>
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
                <div>
                  <p className="font-semibold text-gray-700">
                    {" "}
                    {like.displayName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatTimestamp(like?.timestamp)}
                  </p>
                </div>
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
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        comment?.photoURL ||
                        "images/User-Profile-PNG-Clipart.png"
                      }
                      alt="profile"
                      className="size-8 rounded-full"
                    />
                    <div className="text-xs md:text-base font-semibold text-gray-600 text-nowrap">
                      <p>{comment?.displayName}</p>
                      <p className="text-gray-500 text-xs font-normal">
                        {formatTimestamp(comment?.timestamp)}
                      </p>
                    </div>
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
