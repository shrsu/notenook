import { Link } from "react-router-dom";
import { useContext } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UserContext } from "../../context/userContext";

function HeaderProfile() {
  const { user } = useContext(UserContext);
  console.log(user?.avatar);
  return (
    <div className="py-2 px-4 rounded-md">
      <Link
        to={"/notenook/profile"}
        className="flex gap-3 justify-between items-center"
      >
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>Nn</AvatarFallback>
        </Avatar>
        <p className="text-sm md:text-base w-[70px] overflow-hidden whitespace-nowrap text-ellipsis">
          {user?.username}
        </p>{" "}
      </Link>
    </div>
  );
}

export default HeaderProfile;
