import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

import { DeviceWidthContext } from "../../context/deviceWidthContext";
import { useChatContext } from "../../context/chatContext";

import ActionLoader from "../../components/Loaders/ActionLoader";
import ChatPageForDesktop from "../../components/ChatPageCompontents/ChatPageForDesktop";
import ChatPageForPhones from "../../components/ChatPageCompontents/ChatPageForPhones";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

const ChatPage = () => {
  const width = useContext(DeviceWidthContext);
  const { users, friends, error, loading, setUsers } = useChatContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [topUser, setTopUser] = useState(null);
  const [chatSocket, setChatSocket] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = extractTokenFromCookie();
    if (!token) {
      console.error("No token found.");
      return;
    }

    const socketConnection = io(
      import.meta.env.VITE_REACT_APP_CHAT_SOCKET_ENDPOINT,
      {
        auth: { token },
      }
    );

    setChatSocket(socketConnection);

    socketConnection.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socketConnection.on("connectionSuccess", (data) => {
      console.log(data.message);
    });

    socketConnection.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketConnection.on("newChatCreated", (newChat) => {
      setUsers((prevUsers) => {
        return [
          { _id: newChat.senderId, username: newChat.senderUsername },
          ...prevUsers,
        ];
      });
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (topUser) {
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(
          (user) => user._id === topUser._id
        );
        if (userIndex > -1) {
          const updatedUsers = [...prevUsers];
          const [userToMove] = updatedUsers.splice(userIndex, 1);
          updatedUsers.unshift(userToMove);
          return updatedUsers;
        }
        return prevUsers;
      });
    }
  }, [topUser]);

  useEffect(() => {
    if (selectedUser) {
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(
          (user) => user._id === selectedUser._id
        );
        if (userIndex === -1) {
          return [selectedUser, ...prevUsers];
        }
        return prevUsers;
      });
    }
  }, [selectedUser]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="page">
      {loading && <ActionLoader action={"Loading Chats..."} />}
      {width > 900 ? (
        <ChatPageForDesktop
          users={users}
          friends={friends}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          topUser={topUser}
          setTopUser={setTopUser}
          chatSocket={chatSocket}
        />
      ) : (
        <ChatPageForPhones
          users={users}
          friends={friends}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          topUser={topUser}
          setTopUser={setTopUser}
          chatSocket={chatSocket}
          location={location}
        />
      )}
    </div>
  );
};

export default ChatPage;
