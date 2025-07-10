import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import OAuth from "../components/OAuth";
import { toast } from "react-toastify";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [emailError, setEmailError] = useState("");
  const [userNameError, setUserNameError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error states
    setError(null);
    setEmailError("");
    setUserNameError("");

    if (!email || !userName || !password || !checkbox) {
      const errorMsg = "Please fill up all the fields.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const formData = {
      email,
      username: userName,
      password,
    };

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        const msg = data.message || "Something went wrong during signup.";

        if (msg.includes("E11000")) {
          if (msg.includes("email")) {
            const errorMsg = "Email already exists.";
            setEmailError(errorMsg);
            toast.error(errorMsg);
          } else if (msg.includes("username")) {
            const errorMsg = "Username already exists.";
            setUserNameError(errorMsg);
            toast.error(errorMsg);
          } else {
            setError(msg);
            toast.error(msg);
          }
          return;
        } else {
          setError(msg);
          toast.error(msg);
        }
      } else {
        toast.success("Signup successful!");
        setEmail("");
        setUserName("");
        setPassword("");
        setCheckbox(false);
        navigate("/sign-in");
      }
    } catch (err) {
      toast.error("🚫 Network error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 pt-15">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join our community and start something awesome.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="flex mb-1 items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
                {emailError && (
                  <span className="text-red-500 dark:text-red-400 text-sm font-normal">
                    {emailError}
                  </span>
                )}
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                type="email"
                id="email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  emailError
                    ? "border-red-500 text-red-600 dark:text-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition`}
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />
            </div>

            {/* Username Field */}
            <div>
              <label
                htmlFor="user-name"
                className="flex mb-1 items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
                {userNameError && (
                  <span className="text-red-500 dark:text-red-400 text-sm font-normal">
                    {userNameError}
                  </span>
                )}
              </label>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value.trim())}
                type="text"
                id="user-name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  userNameError
                    ? "border-red-500 text-red-600 dark:text-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition`}
                placeholder="Enter your unique username"
                autoComplete="off"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={checkbox}
                  onChange={(e) => setCheckbox(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 bg-gray-100 dark:bg-gray-700 cursor-pointer"
                  required
                />
              </div>
              <label
                htmlFor="terms"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                I agree with the{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  terms and conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 cursor-pointer rounded-lg font-medium text-white ${
                isLoading
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" />
                  <span className="ml-2">Creating account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-gray-200 dark:bg-gray-600 text-sm text-gray-800 dark:text-gray-100">
                  or
                </span>
              </div>
            </div>

            {/* Google Sign-in Button */}
            <OAuth />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
