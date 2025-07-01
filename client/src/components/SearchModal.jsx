import { motion, AnimatePresence } from "framer-motion";

const SearchModal = ({ setIsModalOpen }) => {
  return (
    <div
      aria-hidden="false"
      tabIndex="-1"
      onClick={() => setIsModalOpen(false)}
      className="fixed inset-0 px-2 z-[100] flex min-h-screen justify-center items-start pt-28 backdrop-blur-md bg-gray-950/90"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-2xl w-full max-w-md transform border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Search
          </h3>
          <button
            aria-label="Close modal"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m6 18 12-12M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Search blogs or articles…"
          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              /* search action */
              alert("Funtionality not yet applied");
            }}
            className="bg-blue-500 px-4 py-2 rounded-md font-semibold text-gray-100 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Search
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchModal;
