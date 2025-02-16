import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firbase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-8">
      <div className="flex flex-col md:flex-row items-center max-w-4xl w-full px-6 md:px-0">
        {/* Left Side - Branding */}
        <div className="text-center md:text-left md:w-1/2 mb-6 md:mb-0">
          <h1 className="text-4xl font-bold text-blue-600">Gasspace</h1>
          <p className="mt-2 text-lg">Your gate to freedom.</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                id="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgotten password?
            </Link>
          </div>

          <hr className="my-4" />

          <div className="text-center">
            <Link
              to="/register"
              className="bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
