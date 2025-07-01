import { useDispatch, useSelector } from "react-redux";
import { themeToggle } from "../redux/theme/themeSlice";
import { GoSun } from "react-icons/go";
import { BsMoonStars } from "react-icons/bs";
import { motion } from "framer-motion";

const ThemeTogglerButton = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.theme === "dark");

  return (
    <button
      onClick={() => dispatch(themeToggle())}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative select-none cursor-pointer h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-between px-2 w-[4.6rem] transition-colors duration-300"
    >
      <span
        className={`text-xs font-medium transition-colors duration-300 ${
          !isDark ? "text-gray-900" : "text-gray-400"
        }`}
      >
        Light
      </span>
      <span
        className={`text-xs font-medium transition-colors duration-300 ${
          isDark ? "text-gray-100" : "text-gray-500"
        }`}
      >
        Dark
      </span>

      <motion.div
        animate={{ x: isDark ? 36 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 bottom-0.5 left-0 w-9 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm"
      >
        {isDark ? (
          <GoSun className="text-yellow-400 text-sm" />
        ) : (
          <BsMoonStars className="text-indigo-500 text-sm" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeTogglerButton;
