import { format, getYear } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Message = ({
  message,
  createdAt,
  senderId,
  selectedUser,
  userAvatar,
}) => {
  const date = new Date(createdAt);
  const currentYear = new Date().getFullYear();
  const isReceived = senderId === selectedUser._id;

  const formatString =
    getYear(date) === currentYear ? "MM/dd, h:mm a" : "MM/dd/yyyy, h:mm a";

  return (
    <div
      className={`flex items-end mb-6 max-w-[60%] ${
        isReceived ? "self-start" : "self-end"
      }`}
    >
      {isReceived && (
        <Avatar className="h-[30px] w-[30px] mr-2">
          <AvatarImage src={selectedUser.avatar} />
          <AvatarFallback>Nn</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`px-3 py-2 rounded-sm relative ${
          isReceived ? "bg-neutral-800" : "bg-neutral-950"
        }`}
      >
        <p>{message}</p>
        <span className="text-xs text-gray-500">
          {format(date, formatString)}
        </span>
      </div>
      {isReceived ? null : (
        <Avatar className="h-[30px] w-[30px] ml-2">
          <AvatarImage src={userAvatar} />
          <AvatarFallback>Nn</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Message;
