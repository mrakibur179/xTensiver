import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setError(null);
      try {
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch users");

        setComments(data.comments);
        setShowMore(data.comments.length === 9);
      } catch (error) {
        console.error("Fetch comments error:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser.isSuperAdmin) {
      fetchComments();
    }
  }, [currentUser.isSuperAdmin]);

  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await fetch(
        `/api/comment/getComments?startIndex=${startIndex}`
      );
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to fetch more comments");

      setComments((prev) => [...prev, ...data.comments]);
      if (data.comments.length < 9) setShowMore(false);
    } catch (error) {
      console.error("Show more error:", error.message);
      setError(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setOpenModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentIdToDelete)
      );
    } catch (error) {
      console.error("Delete error:", error.message);
      setError(error.message);
    }
  };

  if (!currentUser.isSuperAdmin) {
    return <div className="text-center text-red-500 mt-4">Access Denied</div>;
  }

  return (
    <div className="table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-600 dark:scrollbar-thumb-slate-800">
      {isLoading ? (
        <div className="w-full mt-12 flex items-center flex-col">
          <Spinner aria-label="Loading spinner" />
        </div>
      ) : !currentUser.isSuperAdmin ? (
        <h1 className="text-red-600 text-xl p-4">Access Denied!</h1>
      ) : error ? (
        <div className="text-red-600 text-center p-4 font-medium">{error}</div>
      ) : comments.length > 0 ? (
        <div className="overflow-x-auto p-4">
          <Table hoverable className="w-full p-2">
            <TableHead>
              <TableRow>
                <TableHeadCell className="w-48 whitespace-nowrap px-4 py-3">
                  Updated At
                </TableHeadCell>
                <TableHeadCell className="px-2 py-3 truncate">
                  Comment
                </TableHeadCell>
                <TableHeadCell className="min-w-[200px] max-w-[300px] truncate px-4 py-3">
                  UserName
                </TableHeadCell>
                <TableHeadCell className="min-w-[200px] max-w-[240px] px-4 py-3">
                  Post
                </TableHeadCell>
                <TableHeadCell className="w-32 whitespace-nowrap px-4 py-3">
                  Number of Likes
                </TableHeadCell>

                <TableHeadCell className="w-20 px-2 py-3">Delete</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y dark:bg-slate-900 bg-slate-100">
              {comments?.map((comment) => (
                <TableRow
                  key={comment._id}
                  className="hover:bg-sky-100 dark:hover:bg-slate-950/50"
                >
                  <TableCell className="w-48 whitespace-nowrap px-4 py-2">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="px-2 py-2 min-w-sm break-all">
                    {comment.content}
                  </TableCell>
                  <TableCell className="min-w-[200px] max-w-[240px] px-4 py-2">
                    {comment.userId?.username || "Unknown User"}
                  </TableCell>
                  <TableCell className="min-w-[200px] max-w-[300px] truncate px-4 py-2 text-blue-600 hover:underline">
                    <Link to={`/post/${comment.postId?.slug}`}>
                      {comment.postId?.title}
                    </Link>
                  </TableCell>
                  <TableCell className="w-32 whitespace-nowrap px-4 py-2">
                    {comment.numberOfLikes}
                  </TableCell>

                  <TableCell className="w-20 px-2 py-2">
                    <button
                      onClick={() => {
                        setOpenModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <div className="w-full p-4">
              <button
                onClick={handleShowMore}
                className="text-white bg-blue-600 px-4 py-2 rounded-md"
              >
                Show More...
              </button>
            </div>
          )}
        </div>
      ) : (
        <h1 className="text-left text-2xl p-4">No Users Yet!</h1>
      )}

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="alternative" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
