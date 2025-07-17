import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { Link, useParams } from "react-router-dom";
import { CallToAction } from "../components/CallToAction";
import { CommentSection } from "../components/CommentSection";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";

export const PostPage = () => {
  const { postSlug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  const [recentArticles, setRecentArticles] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  // Save scroll position before reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(`scroll-${postSlug}`, window.scrollY);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [postSlug]);

  // Restore scroll position after post loads
  useEffect(() => {
    if (post) {
      const savedScroll = localStorage.getItem(`scroll-${postSlug}`);
      if (savedScroll) {
        window.scrollTo({ top: parseInt(savedScroll), behavior: "instant" });
        localStorage.removeItem(`scroll-${postSlug}`);
      }
    }
  }, [post, postSlug]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok || !data.posts || data.posts.length === 0) {
          throw new Error("Post not found");
        }

        setPost(data.posts[0]);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error(error.message);
        setError("Something went wrong. Try again later.");
        setIsLoading(false);
      }
    };

    const fetchRecentArticles = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=3");
        const data = await res.json();
        if (res.ok) {
          setRecentArticles(data.posts);
        }
      } catch (error) {
        console.error("Error fetching recent articles:", error);
      }
    };

    fetchPost();
    fetchRecentArticles();
  }, [postSlug]);

  if (isLoading)
    return (
      <div className="grid h-screen place-items-center">
        <Spinner size="xl" />
      </div>
    );

  if (error)
    return (
      <div className="grid h-screen place-items-center text-center text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="px-4 mx-auto max-w-7xl flex items-start flex-col lg:flex-row gap-4 justify-center py-20 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      <div className="min-w-2/3  mx-auto">
        <span className="py-4">
          Home {`>`} posts {`>`} {postSlug}
        </span>

        {post.poster && (
          <div className="aspect-[16/9] py-4 w-full overflow-hidden">
            <img
              src={post.poster}
              alt={post.title}
              className="w-full h-full object-cover md:group-hover:scale-102 rounded-md transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <h1 className="text-2xl flex gap-8 items-center sm:text-4xl font-bold">
          {post.title}
          {currentUser?.isSuperAdmin || currentUser?._id === post.userId._id ? (
            <Link
              className="text-xl hover:text-blue-600"
              to={`/update-post/${post._id}`}
            >
              <FaRegEdit />
            </Link>
          ) : (
            ""
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          {post.description}
        </p>
        <span className="text-sm flex items-center flex-wrap gap-2 py-4 text-gray-600 dark:text-gray-400">
          <p>Tags:</p>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              className="dark:text-blue-200 text-blue-800 hover:underline bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full"
              to="#"
            >
              #{tag}
            </Link>
          ))}
        </span>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>
            Updated At:{" "}
            {new Date(post.updatedAt || post.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
          <span>Author - {post.userId?.username || "unauthored"}</span>
        </div>

        <br />

        <div className="ql-editor prose prose-img:mx-auto prose-li:marker:text-indigo-600 prose-ol:list-decimal prose-ul:list-disc max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="max-w-full">
          <CallToAction />
        </div>

        <CommentSection postId={post._id} />
      </div>

      <div className="min-w-1/3 mx-auto">
        <div className="sticky top-24">
          <h2 className="text-2xl font-bold mb-4">Recent Articles</h2>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <Link
                key={article._id}
                to={`/post/${article.slug}`}
                className="block group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 hover:shadow-sm"
              >
                <div className="flex gap-4">
                  {article.poster && (
                    <div className="flex-shrink-0 relative w-20 h-16 rounded-lg overflow-hidden">
                      <img
                        src={article.poster}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x64?text=No+Image";
                          e.target.className =
                            "w-full h-full object-cover bg-gray-100 dark:bg-gray-600";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {article.title}
                    </h3>

                    {/* {article.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {article.description}
                      </p>
                    )} */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(article.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="py-4">
            <h1 className="py-4">Popular Tags:</h1>
            {recentArticles.map((article) => (
              <Link
                className="mr-2 w-fit px-3 py-1 rounded-full text-black bg-gray-200"
                key={article.tags}
              >
                {article.tags[0]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
