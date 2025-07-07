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

  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  // console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // setIsLoading(true);
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        } else {
          console.log(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser.isAdmin, currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
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

      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-600 dark:scrollbar-thumb-slate-800">
      {isLoading ? (
        <div className="w-full mt-12 flex items-center flex-col">
          <Spinner aria-label="Center-aligned spinner example" />
        </div>
      ) : currentUser.isAdmin && userPosts.length > 0 ? (
        <div className="overflow-x-auto p-4">
          <Table hoverable className="p-2">
            <TableHead>
              <TableRow>
                <TableHeadCell className="min-w-full truncate">
                  Updated At
                </TableHeadCell>
                <TableHeadCell className="min-w-full truncate">
                  Post Image
                </TableHeadCell>
                <TableHeadCell className="min-w-full truncate">
                  Post Title
                </TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Edit</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y">
              {userPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="min-w-full truncate">
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.poster}
                        alt={post.title}
                        className="w-20 h-10 object-cover rounded"
                      />
                    </Link>
                  </TableCell>
                  <TableCell className="min-w-full truncate">
                    <Link to={`/post/${post.slug}`} className="underline">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>

                  <TableCell>
                    <Link
                      to={`/update-post/${currentUser._id}`}
                      className="text-blue-500 hover:underline cursor-pointer"
                    >
                      Edit
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full self-center px-4 text-teal-200 cursor-pointer hover:underline py-7"
            >
              Show More
            </button>
          )}
        </div>
      ) : (
        <>
          <h1 className="text-left text-2xl p-4">
            You don't have any post yet.
            <span className="p-2 text-blue-800 underline cursor-pointer">
              <Link to="/create-post">Create One</Link>
            </span>
          </h1>
        </>
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
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                onClick={handleDeletePost}
                className="cursor-pointer"
              >
                Yes, I'm sure
              </Button>
              <Button
                className="cursor-pointer"
                color="alternative"
                onClick={() => setOpenModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
