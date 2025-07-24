import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiUsers, HiDocumentText, HiArrowRight } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
import { HiChat } from "react-icons/hi";

export const DashboardMain = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);

  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.search]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (!res.ok || !data.users) throw new Error("Failed to fetch users");

        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setLastMonthUsers(data.lastMonthUsers);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getComments?limit=5");
        const data = await res.json();
        if (!res.ok || !data.comments)
          throw new Error("Failed to fetch comments");

        setComments(data.comments);
        setTotalComments(data.totalComments);
        setLastMonthComments(data.lastMonthComments);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts?limit=5");
        const data = await res.json();
        if (!res.ok || !data.posts) throw new Error("Failed to fetch posts");

        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.lastMonthPosts);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser.isSuperAdmin) {
      fetchUsers();
      fetchComments();
      fetchPosts();
    }
  }, [currentUser]);

  if (!currentUser.isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center text-red-500 mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8 mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          icon={<HiUsers className="text-3xl text-blue-500" />}
          label="Total Users"
          value={totalUsers}
          sub={`+${lastMonthUsers} last month`}
          link="/dashboard?tab=users"
        />
        <StatCard
          icon={<HiChat className="text-3xl text-green-500" />}
          label="Total Comments"
          value={totalComments}
          sub={`+${lastMonthComments} last month`}
          link="/dashboard?tab=comments"
        />
        <StatCard
          icon={<HiDocumentText className="text-3xl text-purple-500" />}
          label="Total Posts"
          value={totalPosts}
          sub={`+${lastMonthPosts} last month`}
          link="/dashboard?tab=posts"
        />
      </div>

      {/* Content Sections */}
      <div className="flex flex-col gap-6">
        {/* Recent Users */}
        <Section title="Recent Users" link="/dashboard?tab=users">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/default-avatar.png"; // Fallback local image
                  }}
                />
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {user.isAdmin ? "Admin" : "User"}
              </span>
            </div>
          ))}
        </Section>

        {/* Recent Posts */}
        <Section title="Recent Posts" link="/dashboard?tab=posts">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/post/${post.slug}`}
              className="flex items-center justify-between gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={post.poster || "/no-image.png"}
                  alt="Post"
                  className="w-14 h-10 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-semibold line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {post.tags?.join(", ") || "No tags"}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </Section>

        {/* Recent Comments */}
        <Section title="Recent Comments" link="/dashboard?tab=comments">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <Link to={comment.postId ? `/post/${comment.postId.slug}` : "#"}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        comment.userId?.profilePicture || "/default-avatar.png"
                      }
                      alt="User"
                      className="w-8 h-8 mt-2 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "/default-avatar.png"; // Fallback local image
                      }}
                    />
                    <span className="text-sm font-medium">
                      {comment.userId?.username || "Deleted User"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-300 line-clamp-2 ml-10">
                  {comment.content}
                </p>
                <div className="flex gap-3 flex-wrap text-xs text-gray-500 mt-2 ml-10">
                  <span>Likes: {comment.numberOfLikes}</span>
                  <span>Post: {comment.postId?.title || "Deleted Post"}</span>
                </div>
              </Link>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ icon, label, value, sub, link }) => (
  <Link
    to={link}
    className="p-4 rounded-lg shadow-sm dark:bg-slate-900 bg-slate-100 dark:border-gray-700 hover:shadow-md transition hover:border-blue-300 dark:hover:border-blue-700 group"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 dark:bg-gray-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-gray-600 transition">
        {icon}
      </div>
      <div>
        <h4 className="text-2xl font-bold">{value}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">{sub}</p>
      </div>
    </div>
  </Link>
);

const Section = ({ title, children, link }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 h-fit">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        {title}
      </h2>
      <Link
        to={link}
        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        See all <HiArrowRight className="text-sm" />
      </Link>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);
