import { Link } from "react-router-dom";

import { Card, CardHeader, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import formatDate from "../../Functions/FormatDate";

function Comment({ comment }) {
  return (
    <div className="flex gap-4 items-center w-full mb-4">
      <Avatar>
        <AvatarImage src={comment.postedBy.avatar} alt="User Avatar" />
        <AvatarFallback>{comment.postedBy.username[0]}</AvatarFallback>
      </Avatar>
      <Card className="bg-[#0C0A09] text-white w-full border-neutral-600 border-[0.25px]">
        <CardHeader className="flex items-center flex-row p-2">
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
        </CardHeader>
        <CardContent className="pb-2 ">
          <p>{comment.comment}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Comment;
