import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaRss,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white px-6 pt-12 pb-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">About the Blog</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Sharing thoughts, ideas, and insights on technology, design, and
            creative thinking since 2020.
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Written by:
            </span>
            <span className="text-sm font-medium">Md Rakibur Rahman</span>
          </div>
        </div>

        {/* Blog Categories */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Web Development
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                UI/UX Design
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Productivity
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Career Advice
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Book Reviews
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                All Articles
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                About Me
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Popular Posts
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Writing Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Speaking Engagements
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Get the latest posts delivered right to your inbox. No spam, ever.
          </p>
          <form className="flex flex-col space-y-3 mb-6">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white text-sm border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
            >
              Subscribe
            </button>
          </form>

          <div>
            <h5 className="text-sm font-medium mb-3">Follow Me</h5>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                aria-label="YouTube"
              >
                <FaYoutube className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                aria-label="RSS Feed"
              >
                <FaRss className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-12 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} xTensiver. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
