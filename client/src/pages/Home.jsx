import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { CallToAction } from "../components/CallToAction";
import { PostCard } from "../components/PostCard";
import { useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa";
import { PostCardSkeleton } from "../components/PostCardSkeleton";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [reviewPosts, setReviewPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

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

  useEffect(() => {
    const fetchReviewPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?tag=review");
        const data = await res.json();
        if (res.ok) {
          setReviewPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviewPosts();
  }, []);

  const otherPosts = posts.slice(0, 4);

  return (
    <main className="bg-slate-200 dark:bg-slate-800 scroll-smooth">
      <div className="min-h-screen pt-16 text-gray-800 dark:text-gray-200 px-2 md:px-4 lg:px-6 p-2 container mx-auto">
        {/* Hero Section */}
        <section className="relative rounded-md dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 text-gray-900 px-0 md:px-8 lg:px-16 dark:text-white overflow-hidden">
          {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/5 dark:to-purple-400/5"></div> */}
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              {/* Text Content */}
              <div className="lg:w-4/5 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl py-8 font-bold leading-tight">
                  Stay Ahead with the Latest{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                    News
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
                  Explore deep dives into software, gadgets, and innovation.
                  {/* Curated content for tech lovers, developers, and creators. */}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 min-w-max justify-center lg:justify-start">
                  {currentUser?.isAdmin ? (
                    <Link
                      to={
                        currentUser?.isSuperAdmin
                          ? "/dashboard?tab=main"
                          : "/dashboard?tab=profile"
                      }
                      className="px-8 py-3 min-w-fit bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link
                      to={currentUser ? "/#" : "/sign-in"}
                      className="px-8 py-3 min-w-fit bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform"
                    >
                      {currentUser ? "Welcome" : "Sign In"}
                    </Link>
                  )}
                  <Link
                    to="/search"
                    className="px-8 py-3 min-w-fit bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700/80 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg transition-all duration-300 backdrop-blur-md border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
                  >
                    Browse Articles <FaArrowRight className="mt-0.5" />
                  </Link>
                </div>
              </div>

              {/* Image/Illustration */}
              <div className="lg:w-4/5 relative hidden lg:block">
                <div className="relative">
                  {/* <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-20 blur-lg"></div> */}
                  <img
                    src="/live_chat.png"
                    loading="lazy"
                    alt="Tech Illustration"
                    className="relative w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles */}
        <div className="mt-8">
          {/* Latest Articles & Newsletter Container */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Latest Articles - Takes full width on mobile, 3/4 on desktop */}
            <section className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
                  Latest Articles
                </h2>
                <Link
                  to="/search"
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View all <FaArrowRight className="text-sm" />
                </Link>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-4">
                  {[...Array(4)].map((_, index) => (
                    <PostCardSkeleton key={index} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center text-red-600 dark:text-red-400 font-semibold mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && otherPosts.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No articles available yet. Check back soon!
                  </p>
                </div>
              )}

              {/* Posts Grid - Responsive columns */}
              {!loading && !error && (
                <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-4">
                  {otherPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <section className="my-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Tech Reviews Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Tech Reviews
                </h2>
                <Link
                  to="/search?searchTerm=&tag=Technology"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                >
                  More in Tech Reviews <FaArrowRight className="mt-0.5" />
                </Link>
              </div>

              <div className="flex flex-col gap-6">
                {reviewPosts.slice(0, 2).map((post) => (
                  <Link
                    to={`/post/${post.slug}`}
                    className="no-underline"
                    key={post._id}
                  >
                    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Image section */}
                      <div className="w-full md:w-[320px] aspect-[16/9] flex-shrink-0 overflow-hidden">
                        <img
                          src={post.poster}
                          alt={post.title}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>

                      {/* Text section */}
                      <div className="p-4 flex flex-col justify-between">
                        <div>
                          <span className="uppercase text-xs font-semibold text-purple-600 dark:text-purple-400">
                            Tech Reviews
                          </span>
                          <h3 className="text-xl md:text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">
                            {post.description.substring(0, 120)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
                          <span>
                            📅 {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Advertisement / Side Banner */}
            <div className="w-full place-content-center mx-auto max-w-[1080px] bg-gray-400 dark:bg-gray-400 rounded-lg overflow-hidden lg:w-[300px] flex-shrink-0">
              <div className="text-center p-8 text-black dark:text-white">
                Advertisement
              </div>
            </div>
          </div>
        </section>

        <CallToAction />
      </div>
    </main>
  );
};

export default Home;
