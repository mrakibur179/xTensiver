import { useEffect, useState } from "react";
import moment from "moment";
import { FaEdit, FaHeart, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const Comment = ({ comment, onLike, onEdit, onDelete, handleReply }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Fetch comment user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();

        if (res.ok) setUser(data);
        else throw new Error(data.message || "Failed to fetch user");
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [comment.userId]);

  // Handlers
  const handleEdit = () => {
    setIsEditing(true);
    setEditedComment(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedComment }),
      });

      const data = await res.json();
      if (res.ok) {
        onEdit(comment, editedComment);
        toast.success("Comment updated.");
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed) return toast.error("Reply cannot be empty");

    handleReply(comment._id, trimmed, e);
    setReplyText("");
    setShowReplyBox(false);
  };

  // UI Loading/Error State
  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (error) return <div className="text-sm text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-sm text-gray-500">User not found</div>;

  return (
    <div className="flex gap-3 p-3 border-b dark:border-gray-600 border-gray-300 last:border-b-0">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user.profilePicture || "/default-avatar.png"}
          alt={user.username}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.png";
          }}
        />
      </div>

      {/* Main Body */}
      <div className="flex-1">
        {/* User Info */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-sm">@{user.username}</p>
          <span className="text-gray-400 text-xs">•</span>
          <p className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </p>
        </div>

        {/* Comment Text or Edit Form */}
        <div className="mt-2">
          {isEditing ? (
            <div className="w-full">
              <textarea
                className="border w-full px-2 py-1 rounded-md"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
              <div className="flex gap-4 pt-2 justify-end">
                <button
                  className="px-4 py-1 bg-blue-600 text-white rounded-md"
                  onClick={handleSave}
                >
                  Update
                </button>
                <button
                  className="px-4 py-1 bg-red-600 text-white rounded-md"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:gap-12">
              <p className="text-sm">{comment.content}</p>

              <div className="flex gap-2 mt-2 md:mt-0">
                {currentUser?._id === comment.userId && (
                  <button
                    className="text-blue-400 text-lg"
                    onClick={handleEdit}
                  >
                    <FaEdit />
                  </button>
                )}

                {(currentUser?.isSuperAdmin ||
                  currentUser?._id === comment.userId) && (
                  <button
                    className="text-red-400 text-sm"
                    onClick={() => onDelete(comment._id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Like + Reply Actions */}
        <div className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 mt-4 pt-2">
          <button onClick={() => onLike(comment._id)} className="py-2">
            <FaHeart
              className={`${
                currentUser && comment.likes.includes(currentUser._id)
                  ? "text-red-600"
                  : "text-gray-400"
              } text-2xl cursor-pointer hover:text-red-600 transition`}
            />
          </button>
          <span className="text-sm">
            {comment.likes.length} {comment.likes.length > 1 ? "Likes" : "Like"}
          </span>
          <span className="text-gray-600 text-xs">•</span>
          <button
            className="text-blue-400 hover:underline text-sm"
            onClick={() => setShowReplyBox(!showReplyBox)}
          >
            {showReplyBox ? "Cancel Reply" : "Reply"}
          </button>
        </div>

        {/* Reply Box */}
        {showReplyBox && currentUser && (
          <form onSubmit={handleReplySubmit} className="mt-2">
            <textarea
              rows="2"
              className="border rounded-md w-full px-2 py-1 text-sm"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md mt-1 disabled:opacity-50"
              disabled={!replyText.trim()}
            >
              Reply
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
