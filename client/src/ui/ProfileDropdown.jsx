import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { toast } from "react-toastify";

const ProfileDropdown = ({
  currentUser,
  dropdownOpen,
  setDropdownOpen,
  dropdownRef,
}) => {
  const dropdownVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const dispatch = useDispatch();

  const handleSignOut = async (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        toast.success("Signed out successfully!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="profile-toggle flex cursor-pointer items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
      >
        {currentUser.profilePicture ? (
          <img
            src={currentUser.profilePicture}
            alt="User profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-full h-full text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            key="profile-dropdown"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: "auto" }}
            className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 min-w-max py-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentUser.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser.email}
              </p>
            </div>

            {currentUser.isAdmin && (
              <Link
                to="/create-post"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Create Post
              </Link>
            )}

            <Link
              to="/dashboard?tab=profile"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Dashboard
            </Link>

            <Link
              onClick={handleSignOut}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              Sign out
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
