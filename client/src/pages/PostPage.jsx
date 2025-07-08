import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { useParams } from "react-router-dom";

export const PostPage = () => {
  const { postSlug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

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
    <div className="max-w-5xl mx-auto px-4 py-20 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span className="mr-2">Category:</span>
        <span className="font-medium">{post.category}</span> •{" "}
        <span>
          {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {post.poster && (
        <img
          src={post.poster}
          alt={post.title}
          className="w-full h-full object-cover rounded-md mb-6 shadow"
        />
      )}

      <p className="text-lg leading-relaxed mb-10">{post.description}</p>

      <div
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none break-words overflow-x-hidden"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};
