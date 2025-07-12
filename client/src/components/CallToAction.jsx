import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const CallToAction = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-800 dark:to-pink-600 text-white py-10 px-6 rounded-lg shadow-lg my-10 mx-auto max-w-4xl">
      <h2 className="text-xl md:text-5xl font-bold mb-4 text-center">
        Want to share your voice with the world?
      </h2>
      <p className="text-sm md:text-xl px-4 text-center mb-6">
        Join our community of writers and start publishing your own blog posts
        today!
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to={currentUser ? "#" : "/sign-in"}
          className="border border-white text-white font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-indigo-600 transition"
        >
          {currentUser ? "Welcome" : "Join Now"}
        </Link>
      </div>
    </div>
  );
};
