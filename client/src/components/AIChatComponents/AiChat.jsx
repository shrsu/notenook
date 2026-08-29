import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Message from "./Message";
import AiChatInput from "./AiChatInput";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import SendingLoader from "../Loaders/SendingLoader";
import { Button } from "../ui/button";

const AiChat = ({ setIsAiChatVisible }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_REACT_APP_AI_CHAT_SOCKET, {
      auth: {
        token: extractTokenFromCookie(),
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to AI chat server");
    });

    newSocket.on("connectionSuccess", (data) => {
      console.log(data.message);
      setMessages(
        data.history.map((msg) => ({ role: msg[0], content: msg[1] }))
      );
    });

    newSocket.on("receiveMessage", (data) => {
      console.log(data.assistantMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.assistantMessage },
      ]);
      setIsLoading(false);
    });

    newSocket.on("errorMessage", (error) => {
      console.error(error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: error },
      ]);
      setIsLoading(false);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: messageInput },
      ]);
      setIsLoading(true);
      socket.emit("sendMessage", { content: messageInput });
      setMessageInput("");
    }
  };

  return (
    <div className="p-4 bg-gray-950 h-full w-[500px] max-w-[90vw] rounded-md flex flex-col justify-between">
      <div className="flex w-full justify-between items-center">
        <h1 className="font-bold h-[2rem]">AI Chat</h1>
        <Button
          className="h-fit text-xs"
          onClick={() => setIsAiChatVisible(false)}
        >
          Close
        </Button>
      </div>

      <div className="h-[calc(100%-8rem)] overflow-y-scroll rounded-md pr-2">
        {messages.map((msg, index) => (
          <div className="flex flex-col" key={index}>
            <Message role={msg.role} content={msg.content} />
          </div>
        ))}
        {isLoading && <SendingLoader />}
        <div ref={lastMessageRef}></div>
      </div>
      <div className="h-16">
        <AiChatInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AiChat;
