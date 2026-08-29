import { Link } from "react-router-dom";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardDescription } from "../ui/card";
import { Button } from "../ui/button";

import formatDate from "../../Functions/FormatDate";

const FriendNotification = ({ notification }) => {
  return (
    <Card className="p-4 mb-3 bg-[#09090c] text-white border-[0.1px] border-neutral-900">
      <Link to={`/notenook/viewUser/${notification.relatedUser?._id}`}>
        <div className="flex gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={notification.relatedUser?.avatar}
              alt={`${notification.relatedUser?.username}'s avatar`}
            />
            <AvatarFallback>
              {notification.relatedUser?.username.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{notification.relatedUser?.username}</p>
            <p className="text-xs">{formatDate(notification.createdAt)}</p>
          </div>
        </div>
      </Link>

      <CardDescription className="mt-2 flex flex-col">
        <span className="text-white">{notification.message}</span>
        <span className="self-end mt-2">
          <Link to={`/notenook/viewUser/${notification.relatedUser?._id}`}>
            <Button
              className="text-xs h-fit font-bold text-yellow-600"
              variant="ghost"
            >
              View Profile
            </Button>
          </Link>
        </span>
      </CardDescription>
    </Card>
  );
};

export default FriendNotification;
