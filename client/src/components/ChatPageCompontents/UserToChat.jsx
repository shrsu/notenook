import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserToChat = ({ user, isSelected, onUserClick }) => {
  const handleClick = () => {
    onUserClick(user);
  };

  return (
    <div
      className={`connection flex w-full justify-between py-3 px-2 items-center rounded-md mb-3 hover:bg-[#0C0A09] ${
        isSelected ? "bg-[#1f1a17]" : ""
      }`}
      onClick={handleClick}
    >
      <div className="connectionInfo w-[80%] flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.username.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <p className="connectionUsername">{user.username}</p>
      </div>
    </div>
  );
};

export default UserToChat;
