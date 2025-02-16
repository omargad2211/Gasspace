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
      setError("Error creating account. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign Up
        </h2>
        <p className="text-center text-gray-600 text-sm mb-4">
          It’s quick and easy.
        </p>

        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <label htmlFor="file">
            <img
              src={
                img
                  ? URL.createObjectURL(img)
                  : "images/User-Profile-PNG-Clipart.png"
              }
              alt="Profile Preview"
              className="rounded-full w-16 h-16 cursor-pointer "
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            {...register("displayName", { required: "Full name is required" })}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.displayName && (
            <span className="text-red-500 text-sm">
              {errors.displayName.message}
            </span>
          )}

          {/* Email */}
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          {/* Password */}
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder="New Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          {/* Confirm Password */}
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}

          {/* Error Message */}
          {error && <span className="text-red-500 text-sm">{error}</span>}

          {/* Buttons */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
            <Link to="/login" className="text-blue-500 text-sm hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
