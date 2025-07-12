import { useEffect, useState } from "react";
import { BarsIcon, ChevronDownIcon, CloseIcon, Spinner } from "flowbite-react";
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

  const { currentUser } = useSelector((state) => state.user);

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

    fetchPost();
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
    <div className="px-4 bg-slate-100 dark:bg-slate-800 py-20 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <span className="py-4">
          Home {`>`} posts {`>`} {postSlug}
        </span>

        {post.poster && (
          <img
            src={post.poster}
            alt={post.title}
            className="min-w-[12rem] w-screen sm:w-1/2 h-full mt-4 mx-auto object-cover rounded-md mb-6 shadow"
          />
        )}

        <h1 className="text-3xl flex gap-8 items-center sm:text-4xl font-bold">
          {post.title}
          {currentUser?.isSuperAdmin ? (
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
              className="text-blue-500 hover:underline bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full"
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
    </div>
  );
};
