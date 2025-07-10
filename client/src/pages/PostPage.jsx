import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { useParams } from "react-router-dom";
import { CallToAction } from "../components/CallToAction";

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
      <span className="py-4">
        Home {`>`} posts {`>`} {postSlug}
      </span>

      {post.poster && (
        <img
          src={post.poster}
          alt={post.title}
          className="w-1/2 h-full mt-4 mx-auto object-cover rounded-md mb-6 shadow"
        />
      )}

      <h1 className="text-3xl sm:text-4xl font-bold px-4">{post.title}</h1>
      <p className="text-sm leading-relaxed py-4 px-4 text-gray-600 dark:text-gray-400">
        {post.description}
      </p>

      <div className="text-sm text-gray-500 dark:text-gray-400 px-4">
        <span className="mr-2">Category:</span>
        <span className="font-medium text-blue-400">{post.category}</span>
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

      {/* <article
        className="prose prose-li:marker:text-indigo-600 prose-ol:list-decimal prose-ul:list-disc max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      /> */}

      <div className="ql-editor prose prose-img:mx-auto prose-li:marker:text-indigo-600 prose-ol:list-decimal prose-ul:list-disc max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <CallToAction />
    </div>
  );
};
