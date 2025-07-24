import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Comment } from "./Comment";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export const CommentSection = ({ postId, post }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e, parentCommentId = null) => {
    e.preventDefault();

    const trimmed = comment.trim();
    if (!trimmed) return toast.error("Comment cannot be empty");
    if (trimmed.length > 200) return toast.error("Comment too long");

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: trimmed,
          postId,
          userId: currentUser._id,
          parentCommentId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComment("");
        setComments((prev) => {
          const key = parentCommentId || "root";
          return {
            ...prev,
            [key]: [data, ...(prev[key] || [])],
          };
        });
        toast.success("Comment added!");
      } else {
        toast.error(data.message || "Failed to add comment");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReply = async (parentCommentId, replyText, e) => {
    e.preventDefault();
    if (!replyText.trim()) return toast.error("Reply cannot be empty");
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText,
          postId,
          userId: currentUser._id,
          parentCommentId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComments((prev) => {
          const key = parentCommentId || "root";
          return {
            ...prev,
            [key]: [data, ...(prev[key] || [])],
          };
        });
        toast.success("Reply added!");
      } else {
        toast.error(data.message || "Failed to add reply");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate(
        `/sign-in?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }

    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((key) => {
            updated[key] = updated[key].map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.likes.length,
                  }
                : comment
            );
          });
          return updated;
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (comment, newContent) => {
    setComments((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].map((c) =>
          c._id === comment._id ? { ...c, content: newContent } : c
        );
      });
      return updated;
    });
  };

  const handleDelete = async (commentId) => {
    setOpenModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => {
          const updated = {};
          for (const key in prev) {
            updated[key] = prev[key].filter((c) => c._id !== commentId);
          }
          return updated;
        });
        toast.success("Comment deleted.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderComments = (parentId = "root") => {
    return (comments[parentId] || []).map((comment) => (
      <div
        key={comment._id}
        className={`${
          parentId !== "root"
            ? "ml-6 border-t border-gray-200 dark:border-gray-700"
            : "border border-gray-300 dark:border-gray-600 mt-8 p-1 rounded-md"
        }`}
      >
        <Comment
          post={post}
          comment={comment}
          onLike={handleLike}
          onEdit={handleEdit}
          onDelete={(id) => {
            setOpenModal(true);
            setCommentToDelete(id);
          }}
          handleReply={handleReply}
        />
        {renderComments(comment._id)}
      </div>
    ));
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data); // ✅ directly set the grouped object
        } else {
          toast.error(data.message || "Failed to load comments");
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to load comments");
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div className="w-full">
      {/* User Info or Sign-in Prompt */}
      {currentUser ? (
        <div className="flex items-center gap-2">
          <p>Signed in as:</p>
          <img
            src={currentUser.profilePicture}
            alt="User"
            className="w-6 h-6 object-cover rounded-full"
          />
          <Link to="/dashboard?tab=profile" className="underline">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <p>You must login to comment</p>
          <Link
            className="underline"
            to={`/sign-in?redirect=${encodeURIComponent(
              location.pathname + location.search
            )}`}
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Comment Form */}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border p-6 border-gray-400 dark:border-gray-600 rounded-md mt-4"
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            maxLength="200"
            placeholder="Add a comment..."
            className="w-full border border-gray-400 dark:border-gray-600 px-4 py-2 rounded-md"
          />
          <div className="flex justify-between items-center mt-2">
            <span>{200 - comment.length} characters remaining</span>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* Comments */}
      <div className="mt-6">
        <p className="text-md font-medium">
          Comments{" "}
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
            {(comments["root"] || []).length}
          </span>
        </p>
        <div className="mt-4">{renderComments()}</div>
      </div>

      {/* Delete Modal */}
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="text-lg text-gray-700 mb-5">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={() => handleDelete(commentToDelete)}>
                Yes, I’m sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
