import { Link } from "react-router-dom";

export const PostCard = ({ post }) => {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="group bg-white dark:bg-gray-900 rounded-md overflow-hidden shadow-sm transition-transform duration-300 flex flex-col"
      style={{ contentVisibility: "auto" }}
    >
      {/* Image */}
      <div className="overflow-hidden relative">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={post.poster}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-900 ease-out md:group-hover:scale-102"
          />
        </div>

        {/* Simplified Tags */}
        {post.tags?.length > 0 && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
            {post.tags.slice(0, 1).map((tag, index) => (
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
        <h3 className="text-sm md:text-lg font-semibold line-clamp-2 md:group-hover:text-blue-600 mb-1">
          {post.title}
        </h3>
        <p className="text-[12px] md:text-sm text-gray-500 dark:text-gray-400 hidden md:line-clamp-2 mb-3">
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
