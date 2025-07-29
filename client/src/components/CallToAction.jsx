import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const CallToAction = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-800 dark:to-pink-600 text-white py-10 px-6 rounded-lg shadow-lg my-10 mx-auto max-w-4xl">
      <h2 className="text-xl md:text-5xl font-bold mb-4 text-center">
        Read The More Interesting Blogs
      </h2>
      <p className="text-[12px] md:text-xl px-8 w-full md:w-4/5 mx-auto text-center mb-6">
        Discover the latest trends, insights, and stories in technology,
        software, and innovation.
      </p>
      <div className="md:flex justify-center gap-4 hidden">
        {currentUser ? (
          <span className="border border-white text-white font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-indigo-600 transition">
            Enjoy
          </span>
        ) : (
          <Link
            to={"/sign-in"}
            className="border border-white text-white font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-indigo-600 transition"
          >
            Join Now
          </Link>
        )}
      </div>
    </div>
  );
};
