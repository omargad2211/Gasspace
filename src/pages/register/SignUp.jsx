import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../redux/authApi";
import { PiPlusCircleFill } from "react-icons/pi"; // Importing the plus icon

const SignUpForm = () => {
  const [img, setImg] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }, // isValid checks if the form has errors
  } = useForm({ mode: "onChange" }); // Enables real-time validation
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
      console.log(err);
      setError(err || "Error creating account. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <img
        src="/images/background.webp"
        alt="background"
        className="w-full h-full object-cover fixed"
      />
      <div className="w-full max-w-md bg-white/20 shadow-black/10 backdrop-blur-[5px] border border-white/20 p-6 rounded-lg shadow-md fixed">
        <h2 className="text-2xl font-bold text-center text-blue-800">
          Sign Up
        </h2>
        <p className="text-center text-white/60 text-sm mb-4">
          It’s quick and easy.
        </p>

        {/* Profile Picture */}
        <div className="flex justify-center mb-4 relative">
          <label htmlFor="file" className="relative cursor-pointer">
            <img
              src={
                img
                  ? URL.createObjectURL(img)
                  : "/images/User-Profile-PNG-Clipart.png"
              }
              alt="Profile Preview"
              className="rounded-full w-16 h-16 border"
            />
            {!img && (
              <PiPlusCircleFill
                className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full"
                size={24}
              />
            )}
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
            {...register("displayName", {
              required: "Full name is required",
              validate: (value) =>
                value.trim().split(" ").length >= 2 ||
                "Enter at least two words",
            })}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.displayName && (
            <span className="text-red-500 text-sm">
              {errors.displayName.message}
            </span>
          )}

          {/* Email */}
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9]+@/,
                message: "Email must contain '@' and a number",
              },
            })}
            placeholder="Email address"
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
              validate: (value) =>
                (/[A-Za-z]/.test(value) &&
                  /\d/.test(value) &&
                  /[^A-Za-z0-9]/.test(value)) ||
                "Password must contain a letter, a number, and a symbol",
            })}
            placeholder="New Password"
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
              className={`w-full text-blue-700 px-4 font-bold py-3 rounded-lg transition ${
                isLoading || !isValid
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#D9F8FF] hover:bg-[#a9efff]"
              }`}
              disabled={isLoading || !isValid} // Disable button if loading or form has errors
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
