import { useSelector } from "react-redux";

export const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={theme}>
      <div className="bg-white text-black dark:bg-gray-800 dark:text-white">
        {children}
      </div>
    </div>
  );
};
