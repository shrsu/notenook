import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import SendingLoader from "../Loaders/SendingLoader";

function ViewUserInfo({ userInfo, setUserInfo }) {
  const { userId } = useParams();
  const [isSending, setIsSending] = useState(false);

  const handleFriendRequest = async (action) => {
    const token = extractTokenFromCookie();
    if (!token) {
      return;
    }

    let apiURI = "";
    let method = "";
    let data = {};

    switch (action) {
      case "send":
        apiURI = import.meta.env.VITE_REACT_APP_SEND_FRIEND_REQUEST_ENDPOINT;
        method = "post";
        data = { receiverId: userId };
        break;
      case "unsend":
        apiURI = import.meta.env.VITE_REACT_APP_UNSEND_FRIEND_REQUEST_ENDPOINT;
        method = "delete";
        data = { receiverId: userId };
        break;
      case "accept":
        apiURI = `${
          import.meta.env.VITE_REACT_APP_ACCEPT_FRIEND_REQUEST_ENDPOINT
        }/${userInfo.requestId}`;
        method = "post";
        data = { senderId: userId };
        break;
      case "reject":
        apiURI = `${
          import.meta.env.VITE_REACT_APP_REJECT_FRIEND_REQUEST_ENDPOINT
        }/${userInfo.requestId}`;
        method = "post";
        data = { senderId: userId };
        break;
      case "remove":
        apiURI = import.meta.env.VITE_REACT_APP_REMOVE_FRIEND_ENDPOINT;
        method = "post";
        data = { friendId: userId };
        break;
      default:
        return;
    }

    try {
      setIsSending(true);
      const response = await axios({
        method: method,
        url: apiURI,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });

      setUserInfo((prevState) => {
        let newStatus = prevState.friendshipStatus;

        if (action === "send") newStatus = "pending";
        if (action === "unsend" || action === "reject" || action === "remove")
          newStatus = "none";
        if (action === "accept") newStatus = "friends";

        return { ...prevState, friendshipStatus: newStatus };
      });
    } catch (error) {
      console.error(`Error handling friend request (${action}):`, error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative flex flex-col mx-auto py-2">
      <div className="flex items-center mb-4">
        <Avatar className="h-16 w-16 mr-4">
          <AvatarImage src={userInfo.avatar} alt="User avatar" />
          <AvatarFallback>{userInfo.username.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-semibold">
              {userInfo?.username}
            </CardTitle>
            <CardDescription className="text-sm text-gray-300">
              {userInfo?.fullname}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2 flex gap-10 text-xs">
            <p>
              Notes:{" "}
              <span className="font-semibold text-yellow-500 text-sm">
                {userInfo?.numberOfNotes}
              </span>
            </p>
            <p>
              Connections:{" "}
              <span className="font-semibold text-yellow-500 text-sm">
                {userInfo?.numberOfConnections}
              </span>
            </p>
          </CardContent>
        </div>
      </div>

      <div className="flex gap-4 mt-4 self-end">
        {isSending ? (
          <div className="w-36 flex justify-center">
            <SendingLoader />
          </div>
        ) : (
          <>
            {userInfo?.friendshipStatus === "none" && (
              <Button
                onClick={() => handleFriendRequest("send")}
                className="text-xs h-fit"
              >
                Add Friend
              </Button>
            )}
            {userInfo?.friendshipStatus === "pending" && (
              <Button
                onClick={() => handleFriendRequest("unsend")}
                className="text-xs h-fit"
                variant="destructive"
              >
                Cancel Request
              </Button>
            )}
            {userInfo?.friendshipStatus === "incoming" && (
              <>
                <Button
                  onClick={() => handleFriendRequest("accept")}
                  className="text-xs h-fit"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleFriendRequest("reject")}
                  className="text-xs h-fit"
                  variant="destructive"
                >
                  Reject
                </Button>
              </>
            )}
            {userInfo?.friendshipStatus === "friends" && (
              <Button
                onClick={() => handleFriendRequest("remove")}
                className="text-xs h-fit"
                variant="destructive"
              >
                Remove Friend
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ViewUserInfo;
