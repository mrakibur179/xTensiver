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

export const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setError(null);
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch users");

        if (res.ok) {
          setUsers(data.users);
          setShowMore(data.users.length === 9);
        }
      } catch (error) {
        console.error("Fetch users error:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser.isSuperAdmin) {
      fetchUsers();
    }
  }, [currentUser.isSuperAdmin]);

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to fetch more users");

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Show more error:", error.message);
      setError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setOpenModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
    } catch (error) {
      console.error("Delete error:", error.message);
      setError(error.message);
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      const res = await fetch(`/api/user/toggleadmin/${userId}`, {
        method: "PUT",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Toggle admin failed");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: data.isAdmin } : user
        )
      );
    } catch (error) {
      console.error("Toggle admin error:", error.message);
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
      ) : users.length > 0 ? (
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
                      src={user.profilePicture || "/default-avatar.png"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "/default-avatar.png"; // Fallback local image
                      }}
                    />
                  </TableCell>
                  <TableCell className="min-w-[200px] max-w-[300px] truncate px-4 py-2">
                    {user.username}
                  </TableCell>
                  <TableCell className="w-32 whitespace-nowrap px-4 py-2">
                    {user.email}
                  </TableCell>
                  <TableCell className="w-32 whitespace-nowrap px-4 py-2">
                    {user.isSuperAdmin ? (
                      "Super Admin"
                    ) : (
                      <ToggleSwitch
                        checked={user.isAdmin}
                        onChange={() => handleToggleAdmin(user._id)}
                        className="text-green-600"
                      />
                    )}
                  </TableCell>

                  <TableCell className="w-20 px-2 py-2">
                    <button
                      onClick={() => {
                        setOpenModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer whitespace-nowrap"
                      disabled={user.isSuperAdmin}
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
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={handleDeleteUser}>
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
