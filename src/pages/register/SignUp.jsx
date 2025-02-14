import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../redux/authApi";

const SignUpForm = () => {
  const [img, setImg] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [signUp, { isLoading }] = useSignUpMutation();

  const onSubmit = async (data) => {
    const { displayName, email, password } = data;

    try {
      const response = await signUp({
        displayName,
        email,
        password,
        img,
      }).unwrap();
      if (response?.uid) {
        navigate("/");
      }
    } catch (err) {
      setError("Error creating user: " + err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20 px-4 lg:px-10 py-10 lg:py-0 min-h-screen bg-orange-300 text-slate-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-teal-600 p-6 lg:p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Profile Picture */}
        <div className="mb-4 flex justify-center">
          <label htmlFor="file">
            <img
              src={img ? URL.createObjectURL(img) : "/assets/OIP.jpeg"}
              alt="Profile Preview"
              className="rounded-full w-16 h-16 cursor-pointer mb-4"
            />
          </label>
          <input
            type="file"
            id="file"
            hidden
            accept=".png,.jpeg,.jpg"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-slate-200 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="displayName"
            {...register("displayName", { required: "Full name is required" })}
            className="w-full text-black bg-white px-3 py-2 border border-gray-300 rounded"
            placeholder="Full Name"
          />
          {errors.displayName && (
            <span className="text-red-500">{errors.displayName.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-slate-200 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required" })}
            className="w-full text-black bg-white px-3 py-2 border border-gray-300 rounded"
            placeholder="Your Email"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-slate-200 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full text-black bg-white px-3 py-2 border border-gray-300 rounded"
            placeholder="Your Password"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-slate-200 mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="w-full text-black bg-white px-3 py-2 border border-gray-300 rounded"
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <span className="text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-6">
          <Link to="/">
            <button
              type="button"
              className="btn bg-orange-600 text-white hover:bg-orange-500"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="btn text-white bg-teal-400 hover:bg-teal-300"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
        {error && <span className="text-red-500 mt-4 block">{error}</span>}
      </form>
    </div>
  );
};

export default SignUpForm;
