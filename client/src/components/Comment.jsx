import { useEffect, useState } from "react";
import moment from "moment";

export const Comment = ({ comment }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="flex gap-3 p-3 border-b border-gray-200 last:border-b-0">
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
      </div>
    </div>
  );
};
