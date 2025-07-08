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
import { FaCheck, FaTimes } from "react-icons/fa";

export const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // setIsLoading(true);
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
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
      fetchUsers();
    }
  }, [currentUser.isAdmin, currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(`/api/users/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setOpenModal(false);
      } else {
        console.log(data.message);
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
      ) : currentUser.isAdmin && users.length > 0 ? (
        <div className="overflow-x-auto p-4">
          <Table hoverable className="w-full p-2">
            <TableHead>
              <TableRow>
                <TableHeadCell className="w-48 whitespace-nowrap px-4 py-3">
                  Created At
                </TableHeadCell>
                <TableHeadCell className="px-2 py-3 truncate">
                  User Image
                </TableHeadCell>
                <TableHeadCell className="min-w-[200px] max-w-[240px] px-4 py-3">
                  Username
                </TableHeadCell>
                <TableHeadCell className="w-32 whitespace-nowrap px-4 py-3">
                  Email
                </TableHeadCell>
                <TableHeadCell className="w-32 whitespace-nowrap px-4 py-3">
                  Admin
                </TableHeadCell>
                <TableHeadCell className="w-20 px-2 py-3">Delete</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y dark:bg-slate-900 bg-slate-100">
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-sky-100 dark:hover:bg-slate-950/50"
                >
                  <TableCell className="w-48 whitespace-nowrap px-4 py-2">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="min-w-[200px] max-w-[300px] truncate px-4 py-2">
                    {user.username}
                  </TableCell>
                  <TableCell className="w-32 whitespace-nowrap px-4 py-2">
                    {user.email}
                  </TableCell>
                  <TableCell className="w-32 whitespace-nowrap px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck className="text-green-600" />
                    ) : (
                      <FaTimes className="text-red-600" />
                    )}
                  </TableCell>

                  <TableCell className="w-20 px-2 py-2">
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setUserIdToDelete(user._id);
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
                className="text-teal-50 hover:shadow-2xl rounded-md mx-auto p-2 content-center px-4 bg-blue-600 flex items-center dark:text-gray-50 cursor-pointer"
              >
                Show More...
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <h1 className="text-left text-2xl p-4">No Users Yet!</h1>
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                onClick={handleDeleteUser}
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
