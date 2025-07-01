import { FaSearch } from "react-icons/fa";

const Searchbox = ({ onClick }) => {
  return (
    <div className="relative flex items-center">
      {/* This input is a trigger to show modal instead of a real input field */}
      <input
        onClick={onClick}
        readOnly
        type="text"
        placeholder="Search articles..."
        className="hidden lg:flex px-4 py-[.15rem] rounded-full border border-gray-400 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/80 dark:text-gray-100 transition cursor-pointer"
      />

      {/* This icon is a trigger to show modal */}
      <div
        onClick={onClick}
        className="absolute right-[2px] lg:p-[.35rem] p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
      >
        <FaSearch className="text-gray-600 dark:text-gray-100" />
      </div>
    </div>
  );
};

export default Searchbox;
