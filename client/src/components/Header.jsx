import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { MdClose, MdOutlineMenu } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Searchbox from "./Searchbox";
import { useSelector } from "react-redux";
import ProfileDropdown from "../ui/ProfileDropdown";
import SearchModal from "./SearchModal";
import ThemeTogglerButton from "../ui/ThemeTogglerButton";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const navLinks = [
    { link: "/", title: "Home" },
    { link: "/blogs", title: "Blogs" },
    { link: "/about", title: "About" },
    { link: "/contact", title: "Contact" },
  ];

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "0px";
    sentinel.style.width = "100%";
    sentinel.style.height = "1px";
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 1 }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen, isModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Mobile menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-toggle") // prevent premature close
      ) {
        setMobileMenuOpen(false);
      }

      // Dropdown menu
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".profile-toggle") // prevent premature close
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <header
      className={`fixed top-0 backdrop-blur-sm left-0 dark:bg-gray-900/60 shadow-2xl right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-sm" : "shadow-xs"
      }`}
    >
      <div
        className={`relative transition-all ease-in-out duration-600 ${
          scrolled ? "" : "py-[.25rem]"
        }`}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex z-20 items-center gap-8">
              <Link
                to="/"
                className="text-3xl font-bold text-blue-600 dark:text-blue-400"
                style={{
                  fontFamily: "Rowdies, sans-serif",
                  fontWeight: "300",
                  fontStyle: "normal",
                }}
              >
                xTensiver
              </Link>

              {/* Navigation (visible on desktop only) */}
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.link}
                    to={item.link}
                    className={({ isActive }) =>
                      `font-[500] ${
                        isActive
                          ? "text-blue-600 dark:text-white"
                          : "text-gray-700 dark:text-gray-400"
                      } hover:text-blue-600 dark:hover:text-white transition-colors`
                    }
                  >
                    {item.title}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right - Search, Theme, User (visible on desktop only) */}
            <div className="hidden md:flex items-center gap-4">
              <Searchbox onClick={() => setIsModalOpen(true)} />

              <ThemeTogglerButton />

              {currentUser ? (
                <ProfileDropdown
                  currentUser={currentUser}
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  dropdownRef={dropdownRef}
                />
              ) : (
                <Link
                  to="/sign-in"
                  className="border text-sm px-4 py-1.5 rounded-full transition border-gray-400 text-black dark:text-white hover:bg-gray-50/50 dark:hover:bg-gray-800"
                >
                  Sign-In
                </Link>
              )}
            </div>

            {/* Mobile - Only Logo + Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Searchbox onClick={() => setIsModalOpen(true)} />
              {currentUser ? (
                <ProfileDropdown
                  currentUser={currentUser}
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  dropdownRef={dropdownRef}
                />
              ) : (
                ""
              )}
              {/* {!isModalOpen && ( */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-toggle z-50 cursor-pointer flex items-center justify-center w-10 h-10 transition-colors text-gray-700 dark:text-gray-300"
              >
                {mobileMenuOpen ? (
                  <MdClose className="text-3xl" />
                ) : (
                  <MdOutlineMenu className="text-3xl" />
                )}
              </button>
              {/* )} */}
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                ref={menuRef}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={mobileMenuVariants}
                className="fixed md:hidden inset-0 left-16 shadow-lg pt-20 min-h-screen z-40 bg-purple-100 dark:bg-gray-950 backdrop-blur-lg p-6 overflow-y-auto"
              >
                {/* Nav links */}
                <nav className="flex flex-col space-y-4 mb-6">
                  {navLinks.map((item) => (
                    <NavLink
                      key={item.link}
                      to={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `${
                          isActive ? "bg-gray-700 text-white" : ""
                        } text-xl font-extralight py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-100`
                      }
                    >
                      {item.title}
                    </NavLink>
                  ))}
                  <div className="self-center">
                    <ThemeTogglerButton />
                  </div>
                </nav>

                {/* Theme Toggle */}

                {/* Auth */}
                <div className="mt-4">
                  {currentUser ? (
                    ""
                  ) : (
                    <Link
                      to="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center border px-4 py-2 rounded-full bg-blue-500 font-semibold border-teal-500 dark:border-teal-500 text-white dark:text-gray-100 hover:bg-blue-600 dark:hover:bg-blue-700 transition"
                    >
                      Sign-In
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal for search */}
      {isModalOpen && <SearchModal setIsModalOpen={setIsModalOpen} />}
    </header>
  );
};

export default Header;
