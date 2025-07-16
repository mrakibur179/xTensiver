import { useEffect, useState } from "react";
import moment from "moment";
import { FaEdit, FaHeart, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);

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
  }, [comment]);

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (error) return <div className="text-sm text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-sm text-gray-500">User not found</div>;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedComment(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedComment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedComment);
        toast.success("Comment Updated.");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex gap-3 p-3 border-b dark:border-gray-600 border-gray-300 last:border-b-0">
      <div className="flex-shrink-0">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user.profilePicture || "/default-avatar.png"}
          alt={user.username}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = "/default-avatar.png"; // Fallback local image
          }}
        />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-sm">
            @{user.username || "Anonymous User"}
          </p>
          <span className="text-gray-400 text-xs">•</span>
          <p className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </p>
        </div>

        <div className="mt-2">
          {isEditing ? (
            <div className="right-auto w-full">
              <textarea
                className="border w-full px-2 py-1 rounded-md"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />

              <div className="flex gap-4 pt-2 justify-end">
                <button
                  className="px-4 cursor-pointer py-1 bg-blue-600 rounded-md"
                  onClick={handleSave}
                >
                  Update
                </button>
                <button
                  className="px-4 cursor-pointer py-1 bg-red-600 rounded-md"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-12 items-center">
              <p className="text-sm">{comment.content}</p>

              <div className="flex gap-2 self-start items-center">
                <span className="mt-[4px]">
                  {currentUser && currentUser?._id === comment.userId && (
                    <button
                      className="text-blue-400 cursor-pointer text-lg"
                      onClick={handleEdit}
                    >
                      <FaEdit />
                    </button>
                  )}
                </span>

                {(currentUser?.isSuperAdmin ||
                  currentUser?._id === comment.userId) && (
                  <button
                    className="text-red-400 cursor-pointer text-sm"
                    onClick={() => onDelete(comment._id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 max-w-fit mt-4">
          <button onClick={() => onLike(comment._id)} className="py-2">
            <FaHeart
              className={`${
                currentUser &&
                comment.likes.includes(currentUser._id) &&
                "text-red-600"
              } text-gray-400 cursor-pointer text-2xl hover:text-red-600 transition`}
            />
          </button>
          <span className="text-sm">
            {comment.likes.length} {comment.likes.length > 1 ? "Likes" : "Like"}
          </span>
          <span className="text-gray-600 text-xs">•</span>
          <button className="text-blue-400 cursor-pointer hover:underline">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};
