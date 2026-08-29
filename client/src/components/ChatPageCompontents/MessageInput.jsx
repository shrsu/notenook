import { useState } from "react";

import axios from "axios";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";

import { IoSend } from "react-icons/io5";

import SendingLoader from "../Loaders/SendingLoader";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

const MessageInput = ({
  userToChatId,
  setMessages,
  messages,
  setTopUser,
  selectedUser,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    const token = extractTokenFromCookie();
    if (!token || !newMessage.trim()) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_SEND_MESSAGE_ENDPOINT
        }/${userToChatId}`,
        {
          message: newMessage,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage("");
      setTopUser(selectedUser);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex absolute -bottom-2 w-[calc(100%-55px)] gap-1 ml-[55px] min-[900px]:ml-0 min-[900px]:relative min-[900px]:w-full min-[900px]:bottom-0 mr-2 mt-4">
      <Textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="text-black resize-none"
        disabled={isLoading}
      />
      <div className="flex items-center justify-center">
        {isLoading ? (
          <div className="h-[50px] aspect-square flex items-center justify-center">
            <SendingLoader />
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={sendMessage}
            className="h-[50px] aspect-square rounded-full"
          >
            <IoSend className="text-xl" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
