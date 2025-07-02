import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

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
            <Link
              to="/dashboard"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Settings
            </Link>
            <Link
              to="/logout"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(false);
              }}
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
