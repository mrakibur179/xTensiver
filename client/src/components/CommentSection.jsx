import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Comment } from "./Comment";

export const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedComment = comment.trim();

    if (trimmedComment.length > 200) {
      alert("Comment cannot exceed 200 characters");
      return;
    }

    if (trimmedComment.trim() === "") {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedComment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComment("");
        setComments((prev) => [data, ...prev]);
        setError(null);
        toast.success("Comment added successfully");
      } else {
        toast.error(data.message || "Failed to add comment");
        setError(data.message);
      }
    } catch (error) {
      setError(error);
      toast.error(error.message || "An error occurred while adding comment");
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div>
      {currentUser ? (
        <div className="flex items-center gap-2">
          <p>Signed in as: </p>
          <img
            className="w-6 h-6 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.profilePicture}
          />
          <Link className="underline" to={`/dashboard?tab=profile`}>
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <p>You must Login to comment</p>
          <Link className="underline" to={"/sign-in"}>
            Signin
          </Link>
        </div>
      )}

      {currentUser && (
        <form onSubmit={handleSubmit} className="border p-6 rounded-md mt-4">
          <textarea
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            className="border w-full px-4 py-2 rounded-md"
          />

          <div className="flex justify-between">
            <p>{200 - comment.length} Characters reamaining</p>
            <button
              type="submit"
              className="bg-blue-400 cursor-pointer hover:shadow-md transition-all duration-300 px-4 py-2 rounded-sm text-black"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm my-5">No Comments Yet!!!</p>
      ) : (
        <div className="my-5">
          <p>
            Comments:{" "}
            <span className="border px-4 py-1 rounded-full">
              {comments.length}
            </span>
          </p>

          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};
