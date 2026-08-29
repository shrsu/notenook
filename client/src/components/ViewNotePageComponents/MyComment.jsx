import { useState } from "react";
import { Link } from "react-router-dom";

import { Card, CardHeader, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import formatDate from "../../Functions/FormatDate";
import SendingLoader from "../Loaders/SendingLoader";

function Comment({ comment, deleteComment }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComment(comment._id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-4 items-center w-full mb-4">
      <Avatar>
        <AvatarImage src={comment.postedBy.avatar} alt="User Avatar" />
        <AvatarFallback>{comment.postedBy.username[0]}</AvatarFallback>
      </Avatar>
      <Card className="bg-[#0C0A09] text-white w-full border-neutral-600 border-[0.25px]">
        <CardHeader className="flex justify-between items-center flex-row p-2">
          <div className="ml-4">
            <Link
              to={`/notenook/viewUser/${comment.postedBy._id}`}
              className="font-bold"
            >
              {comment.postedBy.username}
            </Link>
            <p className="text-gray-400 text-xs">
              Commented at: {formatDate(comment.updatedAt)}
            </p>
          </div>
          {isDeleting ? (
            <SendingLoader />
          ) : (
            <button
              className="delete text-sm text-red-400 self-start px-2 py-1 rounded-sm hover:bg-red-500 hover:text-white transition-colors duration-200 ease-in-out"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </CardHeader>
        <CardContent className="pb-2">
          <p>{comment.comment}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Comment;
