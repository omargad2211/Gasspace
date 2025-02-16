import { useForm } from "react-hook-form";
import { RiImageAddLine } from "react-icons/ri";
import { useState } from "react";
import { useAddPostMutation } from "../../../redux/postsApi";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { storage } from "../../../firebase/firbase";
import { useSelector } from "react-redux";

export default function AddPost() {
  const { currentUser } = useSelector((state) => state.auth);
  // console.log(currentUser);
  const [addPost] = useAddPostMutation();
  const { register, handleSubmit, watch, reset } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const selectedFile = watch("image");

  // Handle Image Preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `Posts/${uuid()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress (optional)
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const onSubmit = async (data) => {
    setUploading(true);
    let imageUrl = null;
    // console.log(data);

    if (data.image && data.image[0]) {
      try {
        imageUrl = await uploadImage(data.image[0]);
      } catch (error) {
        // console.error("Error uploading image:", error);
        setUploading(false);
        return;
      }
    }

    const newPost = {
      uid: currentUser.uid,
      photoURL: currentUser.photoURL,
      displayName: currentUser.displayName,
      image: imageUrl,
      post: data?.post,
    };

    await addPost(newPost);
    reset();
    setPreviewImage(null);
    setUploading(false);
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
          {...register("post", { required: true })}
          className="bg-gray-400/20 rounded-lg flex-1 ring-0 outline-none px-4 py-1 max-h-[200px] overflow-y-auto resize-none"
          placeholder="What's on your mind?"
        />
        <button
          type="submit"
          className={`py-2 px-2 md:px-4 bg-[#D9F8FF] text-blue-700 text-sm md:text-base font-semibold rounded-xl ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Share Post"}
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
