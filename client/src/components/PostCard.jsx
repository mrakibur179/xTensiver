import { Link } from "react-router-dom";

export const PostCard = ({ post }) => {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md md:hover:shadow-lg transition-transform duration-300 flex flex-col"
      style={{ willChange: "transform" }}
    >
      {/* Image */}
      <div className="overflow-hidden relative">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={post.poster}
            alt={post.title}
            className="w-full h-full object-cover md:group-hover:scale-102 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Simplified Tags */}
        {post.tags?.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-2">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-800/90 text-white text-xs font-semibold px-3 py-[6px] rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold md:group-hover:text-blue-600 mb-1">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {post.description}
        </p>
        <div className="text-xs text-gray-400 mt-auto">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </Link>
  );
};
