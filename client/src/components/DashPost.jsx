import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const DashPost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // setIsLoading(true);
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data);
        } else {
          setUserPosts(data.posts);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser.isAdmin, currentUser._id]);

  return (
    <div className="table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-600 dark:scrollbar-thumb-slate-800">
      {isLoading ? (
        <div className="w-full mt-12 flex items-center flex-col">
          <Spinner aria-label="Center-aligned spinner example" />
        </div>
      ) : currentUser.isAdmin && userPosts.length > 0 ? (
        <div className="overflow-x-auto p-4">
          <Table hoverable className="p-2">
            <TableHead>
              <TableRow>
                <TableHeadCell className="min-w-full truncate">
                  Updated At
                </TableHeadCell>
                <TableHeadCell className="min-w-full truncate">
                  Post Image
                </TableHeadCell>
                <TableHeadCell>Post Title</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
                <TableHeadCell>Edit</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y">
              {userPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="min-w-full truncate">
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.poster}
                        alt={post.title}
                        className="w-20 h-10 object-cover rounded"
                      />
                    </Link>
                  </TableCell>
                  <TableCell className="min-w-full truncate">
                    <Link to={`/post/${post.slug}`} className="underline">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <span className="text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-500 hover:underline cursor-pointer">
                      Edit
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>You don't have any post yet</p>
      )}
    </div>
  );
};
