import { Link } from "react-router-dom";
import { IoChatbubbleOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useChatContext } from "../context/chatContext";

function Connections() {
  const { users } = useChatContext();

  return (
    <div className="flex bg-[#09090B] flex-col p-4 connectionsDiv relative h-full rounded-lg overflow-y-hidden">
      {!users?.length && (
        <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-sm text-neutral-300 text-center">
          Your Top connections Appear here
        </p>
      )}

      <h1 className="text-xl font-bold mb-4 text-neutral-400">Chats</h1>

      <div className="h-[94%] max-w-[90vw] overflow-y-scroll auto-rows-min min-h-[300px]">
        {users && users.map((user, i) => <Connection key={i} user={user} />)}
      </div>
    </div>
  );
}

function Connection({ user }) {
  return (
    <div className="connection flex w-full justify-between py-3 px-2 items-center rounded-md mb-3 hover:bg-[#0C0A09]">
      <Link to={`/notenook/viewUser/${user._id}`}>
        <div className="connectionInfo w-[80%] flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="connectionUsername">{user.username}</p>
        </div>
      </Link>

      <Link to={`/notenook/chatPage/${user._id}`}>
        <IoChatbubbleOutline className="text-2xl text-yellow-400" />
      </Link>
    </div>
  );
}

export default Connections;
