import { useEffect, useState } from "react";
import moment from "moment";
import { CiHeart } from "react-icons/ci";

export const Comment = ({ comment }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          throw new Error(data.message || "Failed to fetch user");
        }
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [comment.userId]);

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (error) return <div className="text-sm text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-sm text-gray-500">User not found</div>;

  return (
    <div className="flex gap-3 p-3 border-b dark:border-gray-600 border-gray-300 last:border-b-0">
      <div className="flex-shrink-0">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user.profilePicture || "/default-avatar.png"}
          alt={user.username}
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm">
            @{user.username || "Anonymous User"}
          </p>
          <span className="text-gray-400 text-xs">•</span>
          <p className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </p>
        </div>
        <p className="mt-1 text-sm">{comment.content}</p>

        {liked ? (
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="red"
            viewBox="0 0 24 24"
            onClick={() => setLiked(!liked)}
          >
            <path
              stroke="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
            />
          </svg>
        ) : (
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            onClick={() => setLiked(!liked)}
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
