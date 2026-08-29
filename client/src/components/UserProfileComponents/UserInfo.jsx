import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

import { UserContext } from "../../context/userContext";

import ActionLoader from "../Loaders/ActionLoader";

function UserInfo() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, setIsUserLoggedIn } = useContext(UserContext);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.get(import.meta.env.VITE_APP_LOGOUT_ENDPOINT, {
        withCredentials: true,
      });
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setIsUserLoggedIn(false);
      navigate("/forms/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative flex flex-col mx-auto py-2">
      {isLoggingOut && <ActionLoader action={"Logging out..."} />}
      <div className="flex items-center mb-4">
        <Avatar className="h-16 w-16 mr-4">
          <AvatarImage src={user?.avatar} alt="User avatar" />
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
        <div>
          <Link to="/notenook/profile">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-semibold">
                {user?.username}
              </CardTitle>
              <CardDescription className="text-sm text-gray-300">
                {user?.fullname}
              </CardDescription>
            </CardHeader>
          </Link>
          <CardContent className="mt-2 flex gap-10 text-xs">
            <p>
              Notes:{" "}
              <span className="font-semibold text-yellow-500 text-sm">
                {user?.numberOfNotes}
              </span>
            </p>
            <p>
              Connections:{" "}
              <span className="font-semibold text-yellow-500 text-sm">
                {user?.numberOfConnections}
              </span>
            </p>
          </CardContent>
        </div>
      </div>
      <div className="flex gap-4 mt-4 self-end">
        <Link to="/notenook/profile/edit">
          <Button variant="secondary" className="text-xs h-fit">
            Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          className="text-xs h-fit bg-red-600 hover:bg-red-700"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default UserInfo;
