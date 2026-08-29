import { useState, useEffect, useRef, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import MessageInput from "./MessageInput";
import Message from "./Message";

import { UserContext } from "../../context/userContext";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

const Chat = ({ selectedUser, setSelectedUser, setTopUser, chatSocket }) => {
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);
  const { userToChatId } = useParams();
  const { user } = useContext(UserContext);
  console.log(selectedUser);
  useEffect(() => {
    const token = extractTokenFromCookie();

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_GET_MESSAGES_ENDPOINT
          }/${userToChatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages(response.data.messages);
        setSelectedUser(response.data.userToChat);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (userToChatId && token) {
      fetchMessages();
    }
  }, [userToChatId, setSelectedUser]);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on("receiveMessage", (newMessage, callback) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        if (callback) {
          callback("Message received successfully");
        }
      });

      return () => {
        chatSocket.off("receiveMessage");
      };
    }
  }, [chatSocket]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="page flex flex-col justify-between relative">
      <div className="connectionInfo w-full bg-[#0C0A09] h-fit p-4 rounded-md">
        <Link to={``}>
          <div className="flex items-center gap-4">
            {" "}
            <Avatar>
              <AvatarImage src={selectedUser?.avatar} />
              <AvatarFallback>
                {selectedUser?.username.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold">{selectedUser?.username}</p>
          </div>
        </Link>
      </div>

      <div className="h-[80%] chatMessages overflow-y-scroll mt-4 pr-4">
        {messages.map((msg, index) => (
          <div key={index} ref={lastMessageRef} className="flex flex-col">
            <Message
              message={msg.message}
              createdAt={msg.createdAt}
              senderId={msg.senderId}
              selectedUser={selectedUser}
              userAvatar={user?.avatar}
            />
          </div>
        ))}
      </div>
      <div className="h-[10%]">
        <MessageInput
          userToChatId={userToChatId}
          setMessages={setMessages}
          messages={messages}
          setTopUser={setTopUser}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
};

export default Chat;
