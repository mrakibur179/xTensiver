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
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.poster}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-102 transition duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">
                    {post.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
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
