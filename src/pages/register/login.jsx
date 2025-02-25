import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firbase";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [firebaseError, setFirebaseError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setFirebaseError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/");
    } catch (error) {
      setFirebaseError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-8 relative">
      <img
        src="\images\background2.webp"
        alt="background"
        width={1920}
        height={1080}
        className="w-full h-full object-cover fixed blur-[2px]"
      />
      <div className="flex flex-col md:flex-row items-center max-w-4xl w-full px-6 md:px-0 relative">
        <div className="text-center md:text-left md:w-1/2 mb-6 md:mb-0">
          <h1 className="text-4xl font-bold text-blue-600">Gasspace</h1>
          <p className="mt-2 text-lg text-white shadow-md">Your gate to freedom.</p>
        </div>

        <div className="bg-white/20 shadow-black/10 backdrop-blur-[5px] border border-white/20 p-6 rounded-lg shadow-md w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*@).*$/,
                    message: "Email must contain @ and a number",
                  },
                })}
                placeholder="Email address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    message:
                      "Password must contain a letter, number, and symbol",
                  },
                })}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {firebaseError && (
              <p className="text-red-600 text-sm text-center">
                {firebaseError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || errors.email || errors.password}
              className="w-full bg-[#D9F8FF] text-blue-700 px-4 hover:bg-[#a9efff] font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="text-center pt-8">
            <Link
              to="/register"
              className="bg-blue-700 text-[#e4faff] font-bold py-3 px-4 rounded-lg hover:bg-blue-800 hover:text-white transition"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
