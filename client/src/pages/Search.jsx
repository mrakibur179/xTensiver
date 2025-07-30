import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { PostCardSkeleton } from "../components/PostCardSkeleton";

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allTags, setAllTags] = useState(["All"]);
  const [showMore, setShowMore] = useState(false);

  const [startIndex, setStartIndex] = useState(0);
  const limit = 6; // Number of posts to load per fetch

  const searchTerm = searchParams.get("searchTerm") || "";
  const sort = searchParams.get("sort") || "latest";
  const tag = searchParams.get("tag") || "All";

  const [inputSearch, setInputSearch] = useState(searchTerm);
  const [selectedSort, setSelectedSort] = useState(sort);
  const [selectedTag, setSelectedTag] = useState(tag);

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

  const fetchPosts = async (start, isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
        setShowMore(false); // Reset showMore on initial load
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams();
      params.append("startIndex", start);
      params.append("limit", limit);
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (sort) params.append("order", sort === "latest" ? "desc" : "asc");
      if (tag && tag !== "All") params.append("tag", tag);

      const res = await fetch(`/api/post/getPosts?${params.toString()}`);
      const data = await res.json();
      const receivedPosts = data.posts || [];

      if (start === 0) {
        setPosts(receivedPosts);
      } else {
        setPosts((prev) => [...prev, ...receivedPosts]);
      }

      // Determine if we should show the "Show More" button
      setShowMore(receivedPosts.length >= limit);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setShowMore(false);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  // Reset startIndex when filters change
  useEffect(() => {
    setStartIndex(0);
    fetchPosts(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sort, tag]);

  const handleShowMore = () => {
    const newStartIndex = startIndex + limit;
    fetchPosts(newStartIndex);
    setStartIndex(newStartIndex);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setSearchParams({
      searchTerm: inputSearch,
      sort: selectedSort,
      tag: selectedTag,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row mx-auto px-2 md:px-4 lg:px-6 py-8 gap-6 min-h-screen bg-slate-200 dark:bg-slate-800 pt-18 text-black transition-all ease-in-out duration-300 dark:text-white">
      {/* Sidebar */}
      <div className="w-full mx-auto md:w-2/3 lg:w-1/4">
        <h2 className="text-xl font-semibold mb-4">Search:</h2>
        <form onSubmit={handleApplyFilters}>
          <input
            type="text"
            className="w-full border px-3 py-2 bg-gray-50 rounded-md mb-4 text-gray-600 dark:text-gray-800"
            placeholder="Search posts..."
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
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply Filters"}
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
              setInputSearch("");
              setSelectedSort("latest");
              setSelectedTag("All");
            }}
            disabled={loading}
          >
            Reset Filters
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="w-full mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-start">Blog Post(s):</h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {showMore && posts.length > 0 && (
              <button
                onClick={handleShowMore}
                disabled={loadingMore}
                className="px-4 py-2 w-fit cursor-pointer hover:shadow-xl text-white shadow-2xl bg-blue-600 rounded-md my-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingMore ? "Loading..." : "Show More"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
