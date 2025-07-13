import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { CallToAction } from "../components/CallToAction";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        } else {
          setError(data.message || "Failed to load posts.");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const otherPosts = posts.slice(0, 6);

  return (
    <main className="bg-slate-200 dark:bg-slate-800">
      <div className="min-h-screen pt-28 text-gray-800 dark:text-gray-200 px-4 py-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-5xl font-extrabold leading-tight mb-4">
            Read the most interesting articles
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Welcome to our blog! Dive into the latest articles crafted for you.
          </p>
        </div>

        {/* Call to Action */}
        <CallToAction />

        {/* Latest Articles */}
        <h2 className="text-2xl font-semibold mb-4">Latest Articles</h2>

        {loading && (
          <div className="flex justify-center mt-10">
            <Spinner size="xl" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 font-semibold mt-6">
            {error}
          </div>
        )}

        {!loading && !error && otherPosts.length === 0 && (
          <p>No post available...</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <Link
                key={post._id}
                to={`/post/${post.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="overflow-hidden relative">
                  <img
                    src={post.poster}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-102 transition duration-500"
                  />

                  {/* Tag Badge */}
                  {post.tags?.length > 0 && (
                    <span className="absolute bottom-2 left-0 text-white flex gap-2 text-xs font-semibold px-3 py-1 rounded-full shadow-md transition">
                      {post.tags?.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="backdrop-blur-[6px] group-hover:bg-gray-600/60 text-white text-xs font-semibold px-3 py-[6px] rounded-full shadow-sm drop-shadow-md ring-1 ring-indigo-300 hover:brightness-110 transition"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold group-hover:text-teal-400 mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                    {post.description}
                  </p>
                  <div className="text-xs text-gray-400 mt-auto">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
