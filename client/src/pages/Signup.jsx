import { Link, useNavigate } from "react-router-dom";
import illustration from "../assets/sign-up_page.jpg";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import OAuth from "../components/OAuth";

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
      return setError("Please fill up all the fields.");
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
            setEmailError("Email already exists.");
          } else if (msg.includes("username")) {
            setUserNameError("Username already exists.");
          } else {
            setError(msg);
          }
        } else {
          setError(msg);
        }
      } else {
        alert("✅ Signup successful");
        setEmail("");
        setUserName("");
        setPassword("");
        setCheckbox(false);
        navigate("/sign-in");
      }
    } catch (err) {
      alert("🚫 Network error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 max-w-screen grid place-content-center pt-15 dark:bg-teal-950  text-black transition-all ease-in-out duration-300 dark:text-white">
      <div className="grid justify-center h-full gap-8 md:gap-16 grid-cols-1 lg:grid-cols-2 container p-4">
        <img
          className="rounded-[8px] order-2 lg:order-1 mx-auto self-center max-w-full lg:max-w-full"
          src={illustration}
          alt="illustration"
        />

        <div className="h-full max-w-lg justify-center mx-auto bg-gray-200 dark:bg-gray-950 p-4 px-8 lg:px-16 items-center order-1 lg:order-2 shadow-xl rounded-2xl">
          <h1 className="text-center text-4xl mt-4 mb-2">Sign Up</h1>
          <h3 className="text-gray-500 mb-8 dark:text-gray-400 text-center">
            Join our community and start something awesome.
          </h3>
          <form className="w-full pb-8 flex flex-col" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="flex mb-1 items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Your email
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
                className={`w-full p-2.5 text-sm rounded-lg border ${
                  emailError
                    ? "border-red-500 text-red-600 dark:text-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400`}
                placeholder="enter your email address"
                autoComplete="email"
                required
              />
            </div>

            {/* Username Field */}
            <div className="mb-5">
              <label
                htmlFor="user-name"
                className="flex mb-1 items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Your username
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
                className={`w-full p-2.5 text-sm rounded-lg border ${
                  userNameError
                    ? "border-red-500 text-red-600 dark:text-red-400 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 pr-10`}
                placeholder="enter your unique username"
                autoComplete="off"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Your password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="enter your password"
                  className="w-full p-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start mb-5">
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
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
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
              className={`w-full cursor-pointer py-3 px-5 rounded-full text-sm font-medium text-white ${
                isLoading
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" />
                  <span className="pl-2">Loading...</span>
                </div>
              ) : (
                "Create New Account"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              Have an account?{" "}
              <Link
                to="/sign-in"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
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
