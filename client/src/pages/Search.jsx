import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState(["All"]);

  // Read values from URL
  const searchTerm = searchParams.get("searchTerm") || "";

  const sort = searchParams.get("sort") || "latest";
  const tag = searchParams.get("tag") || "All";

  // Local states for controlled form fields
  const [inputSearch, setInputSearch] = useState(searchTerm);
  const [selectedSort, setSelectedSort] = useState(sort);
  const [selectedTag, setSelectedTag] = useState(tag);

  // Fetch all tags from server
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/post/tags");
        const data = await res.json();
        setAllTags(["All", ...data]);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Fetch posts when any of the query params change
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (sort) params.append("sort", sort);
        if (tag && tag !== "All") params.append("tag", tag);

        const res = await fetch(`/api/post/getPosts?${params.toString()}`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, sort, tag]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setSearchParams({
      searchTerm: inputSearch,
      sort: selectedSort,
      tag: selectedTag,
    });
  };

  useEffect(() => {
    setInputSearch(searchTerm);
  }, [searchTerm]);

  return (
    <div className="flex flex-col lg:flex-row mx-auto px-8 py-8 gap-6 min-h-screen dark:bg-teal-950 pt-18 text-black transition-all ease-in-out duration-300 dark:text-white">
      {/* Sidebar */}
      <div className="w-full mx-auto md:w-2/3 lg:w-1/4">
        <h2 className="text-xl font-semibold mb-4">Search:</h2>
        <form onSubmit={handleApplyFilters}>
          <input
            type="text"
            className="w-full border px-3 py-2 bg-gray-50 rounded-md mb-4 text-gray-600 dark:text-gray-800"
            placeholder="Search posts..."
            defaultValue={inputSearch}
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />

          <label className="block mb-2 font-medium">Sort By:</label>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-4 dark:bg-gray-200 text-black dark:text-gray-800"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>

          <label className="block mb-2 font-medium">Tag:</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-4 dark:bg-gray-200 text-black dark:text-gray-800"
          >
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md font-semibold"
          >
            Apply Filters
          </button>
          <button
            type="button"
            className="w-full my-4 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-md font-semibold"
            onClick={() => {
              setSearchParams({
                searchTerm: "",
                sort: "latest",
                tag: "All",
              });
              // Also reset local state to match
              setInputSearch("");
              setSelectedSort("latest");
              setSelectedTag("All");
            }}
          >
            Reset Filters
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="w-full mx-auto">
        <h2 className="text-2xl font-bold mb-4">Blog Post(s):</h2>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
