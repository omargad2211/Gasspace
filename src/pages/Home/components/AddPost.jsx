import { useForm } from "react-hook-form";
import { RiImageAddLine } from "react-icons/ri";
import { useRef } from "react";

export default function AddPost() {
  const { register, handleSubmit, watch, reset } = useForm();
  const textareaRef = useRef(null);

  // Get selected file name
  const selectedFile = watch("image");

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    reset(); 
  };

  // Auto-expand textarea height
  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
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
          ref={textareaRef}
          onInput={handleInput}
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
        />
      </label>
    </form>
  );
}
