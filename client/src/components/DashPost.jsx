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
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const DashPost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      const url = currentUser.isSuperAdmin
        ? `/api/post/getposts`
        : `/api/post/getposts?userId=${currentUser._id}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch posts");

        setUserPosts(data.posts);
        setShowMore(data.posts.length >= 9);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser.isAdmin || currentUser.isSuperAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    const url = currentUser.isSuperAdmin
      ? `/api/post/getposts?startIndex=${startIndex}`
      : `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load more posts");

      setUserPosts((prev) => [...prev, ...data.posts]);
      if (data.posts.length < 9) setShowMore(false);
    } catch (error) {
      console.error("Show more error:", error.message);
    }
  };

  const handleDeletePost = async () => {
    setOpenModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete post");

      setUserPosts((prev) =>
        prev.filter((post) => post._id !== postIdToDelete)
      );
    } catch (error) {
      console.error("Delete post error:", error.message);
    }
  };

  return (
    <div className="table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-600 dark:scrollbar-thumb-slate-800">
      {isLoading ? (
        <div className="w-full mt-12 flex items-center flex-col">
          <Spinner aria-label="Center-aligned spinner example" />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center p-4 font-medium">{error}</div>
      ) : (currentUser.isAdmin || currentUser.isSuperAdmin) &&
        userPosts.length > 0 ? (
        <div className="overflow-x-auto p-4">
          <Table hoverable className="w-full p-2">
            <TableHead>
              <TableRow>
                <TableHeadCell className="w-48 whitespace-nowrap px-4 py-3">
                  Updated At
                </TableHeadCell>
                <TableHeadCell className="min-w-48 px-2 py-3 truncate">
                  Post Image
                </TableHeadCell>
                <TableHeadCell className="min-w-[200px] max-w-[240px] px-4 py-3">
                  Post Title
                </TableHeadCell>
                <TableHeadCell className="w-32 whitespace-nowrap px-4 py-3">
                  Category
                </TableHeadCell>
                <TableHeadCell className="w-20 px-2 py-3">Edit</TableHeadCell>
                <TableHeadCell className="w-20 px-2 py-3">Delete</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y dark:bg-slate-900 bg-slate-100">
              {userPosts.map((post) => (
                <TableRow
                  key={post._id}
                  className="hover:bg-sky-100 dark:hover:bg-slate-950/50"
                >
                  <TableCell className="w-48 whitespace-nowrap px-4 py-2">
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="w-48 px-2 py-2">
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.poster}
                        alt={post.title}
                        className="w-32 h-16 object-cover rounded"
                      />
                    </Link>
                  </TableCell>
                  <TableCell className="min-w-[200px] max-w-[300px] truncate px-4 py-2">
                    <Link
                      to={`/post/${post.slug}`}
                      className="hover:underline hover:text-blue-600 truncate inline-block max-w-full"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-gray-600">
                      by - {post.userId?.username}
                    </p>
                  </TableCell>
                  <TableCell className="w-32 whitespace-nowrap px-4 py-2">
                    {post.category}
                  </TableCell>
                  <TableCell className="w-20 px-2 py-2">
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-blue-500 hover:underline cursor-pointer whitespace-nowrap"
                    >
                      Edit
                    </Link>
                  </TableCell>
                  <TableCell className="w-20 px-2 py-2">
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer whitespace-nowrap"
                    >
                      Delete
                    </span>
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
        <div className="p-4 text-xl">
          You don't have any posts yet.{" "}
          <Link to="/create-post" className="text-blue-700 underline">
            Create one
          </Link>
        </div>
      )}

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
