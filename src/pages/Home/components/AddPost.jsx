import { useForm } from "react-hook-form";
import { RiImageAddLine } from "react-icons/ri";
import { useState } from "react";
import { useAddPostMutation } from "../../../redux/postsApi";

export default function AddPost() {
  const [addPost] = useAddPostMutation();
  const { register, handleSubmit, watch, reset } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const selectedFile = watch("image");

  // Handle Image Preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const newPost = {
      postText: data.postText,
      image: previewImage || null, // Store URL if available (Firebase Storage should be used instead)
    };

    await addPost(newPost);
    reset();
    setPreviewImage(null);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg p-2 flex flex-col gap-4"
    >
      {/* Post Input */}
      <div className="flex gap-2 items-center">
        <img
          src="/images/User-Profile-PNG-Clipart.png"
          alt="profile"
          className="size-8 rounded-full"
        />
        <textarea
          {...register("postText", { required: true })}
          className="bg-gray-400/20 rounded-lg flex-1 ring-0 outline-none px-4 py-1 max-h-[200px] overflow-y-auto resize-none"
          placeholder="What's on your mind?"
        />
        <button
          type="submit"
          className="py-2 px-2 md:px-4 bg-[#D9F8FF] text-blue-700 text-sm md:text-base font-semibold rounded-xl"
        >
          Share Post
        </button>
      </div>

      {/* Image Upload */}
      <label className="relative flex items-center gap-2 cursor-pointer w-fit">
        <RiImageAddLine className="text-xl text-blue-700" />
        <p>{selectedFile?.[0]?.name || "Image"}</p>
        <input
          {...register("image")}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />
      </label>

      {previewImage && (
        <img
          src={previewImage}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg"
        />
      )}
    </form>
  );
}
