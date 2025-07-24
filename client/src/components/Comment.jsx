import { useEffect, useState } from "react";
import moment from "moment";
import {
  FaEdit,
  FaHeart,
  FaTrash,
  FaReply,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const Comment = ({
  post,
  comment,
  onLike,
  onEdit,
  onDelete,
  handleReply,
  replies = [],
  showReplies: initialShowReplies = true,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(initialShowReplies);

  // Fetch comment user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();

        if (res.ok) setUser(data);
        else throw new Error(data.message || "Failed to fetch user");
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user:", err.message);
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
  if (!user) return <div className="text-sm text-gray-500">User not found</div>;
  if (error) return <div className="text-sm text-red-500">Error: {error}</div>;

  return (
    <div className="overflow-hidden">
      {/* Parent Comment */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-gray-800"
              src={user.profilePicture || "/default-avatar.png"}
              alt={user.username}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
          </div>

          {/* Main Body */}
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center flex-wrap gap-2">
              <p className="font-semibold text-sm truncate">
                @{user.username} {user._id === post.userId._id && "(Author)"}
              </p>
              {console.log(post.userId._id, user._id)}
              <span className="text-gray-400 text-xs">•</span>
              <p className="text-gray-500 text-xs whitespace-nowrap">
                {moment(comment.createdAt).fromNow()}
              </p>
              {comment.edited && (
                <>
                  <span className="text-gray-400 text-xs">•</span>
                  <p className="text-gray-400 text-xs italic">edited</p>
                </>
              )}
            </div>

            {/* Comment Text or Edit Form */}
            <div className="mt-1">
              {isEditing ? (
                <div className="w-full">
                  <textarea
                    className="border w-full px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
                    maxLength="200"
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2 pt-2 justify-end">
                    <button
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                      onClick={handleSave}
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group">
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 mb-2 whitespace-pre-wrap break-words">
                    {comment.content || "No content provided."}
                  </p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                    <button
                      onClick={() => onLike(comment._id)}
                      className="flex items-center gap-1 hover:text-red-500 transition"
                    >
                      <FaHeart
                        className={
                          currentUser && comment.likes.includes(currentUser._id)
                            ? "text-red-600"
                            : "current"
                        }
                      />
                      <span>{comment.likes.length}</span>
                    </button>

                    <button
                      className="flex items-center gap-1 hover:text-blue-500 transition"
                      onClick={() => setShowReplyBox(!showReplyBox)}
                    >
                      <FaReply size={12} />
                      <span>Reply</span>
                    </button>

                    {replies.length > 0 && (
                      <button
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition"
                        onClick={() => setShowReplies(!showReplies)}
                      >
                        {showReplies ? (
                          <FaChevronUp size={12} />
                        ) : (
                          <FaChevronDown size={12} />
                        )}
                        <span>
                          {replies.length}{" "}
                          {replies.length === 1 ? "reply" : "replies"}
                        </span>
                      </button>
                    )}

                    {(currentUser?._id === comment.userId ||
                      currentUser?.isSuperAdmin) && (
                      <div className="flex gap-3 ml-auto transition">
                        {/* Show edit button only for comment author */}
                        {currentUser?._id === comment.userId && (
                          <button
                            className="hover:text-blue-500 transition"
                            onClick={handleEdit}
                          >
                            <FaEdit size={14} />
                          </button>
                        )}

                        {/* Show delete button for comment author or super admin */}
                        {(currentUser?._id === comment.userId ||
                          currentUser?.isSuperAdmin) && (
                          <button
                            className="hover:text-red-500 transition"
                            onClick={() => onDelete(comment._id)}
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reply Box */}
            {showReplyBox && currentUser && (
              <form onSubmit={handleReplySubmit} className="mt-3">
                <textarea
                  rows="2"
                  className="border rounded-md w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Write a reply..."
                  value={replyText}
                  maxLength="200"
                  onChange={(e) => setReplyText(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    onClick={() => setShowReplyBox(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={!replyText.trim()}
                  >
                    Post Reply
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Replies Section */}
      {replies.length > 0 && showReplies && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {replies.map((reply) => (
            <div
              key={reply._id}
              className="pl-12 pr-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-800"
                    src={reply.user?.profilePicture || "/default-avatar.png"}
                    alt={reply.user?.username}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>

                {/* Reply Body */}
                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">
                      @{reply.user?.username || "Unknown User"}
                    </p>
                    <span className="text-gray-400 text-xs">•</span>
                    <p className="text-gray-500 text-xs whitespace-nowrap">
                      {moment(reply.createdAt).fromNow()}
                    </p>
                    {reply.edited && (
                      <>
                        <span className="text-gray-400 text-xs">•</span>
                        <p className="text-gray-400 text-xs italic">edited</p>
                      </>
                    )}
                  </div>

                  {/* Reply Text */}
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 mb-1 whitespace-pre-wrap break-words">
                    {reply.content || "No content provided."}
                  </p>

                  {/* Reply Actions */}
                  <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mt-1">
                    <button
                      onClick={() => onLike(reply._id)}
                      className="flex items-center gap-1 hover:text-red-500 transition"
                    >
                      <FaHeart
                        className={
                          currentUser && reply.likes.includes(currentUser._id)
                            ? "text-red-600"
                            : "current"
                        }
                      />
                      <span>{reply.likes.length}</span>
                    </button>

                    {(currentUser?.isSuperAdmin ||
                      currentUser?._id === reply.userId) && (
                      <div className="flex gap-3">
                        <button
                          className="hover:text-blue-500 transition"
                          onClick={() => {
                            setIsEditing(true);
                            setEditedComment(reply.content);
                          }}
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          className="hover:text-red-500 transition"
                          onClick={() => onDelete(reply._id)}
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
