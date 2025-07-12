import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      {currentUser ? (
        <div className="flex items-center gap-2">
          <p>Signed in as: </p>
          <img
            className="w-6 h-6 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.profilePicture}
          />
          <Link className="underline" to={`/dashboard?tab=profile`}>
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <p>You must Login to comment</p>
          <Link className="underline" to={"/sign-in"}>
            Signin
          </Link>
        </div>
      )}
    </div>
  );
};
