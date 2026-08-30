import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Message from "./Message";
import Sources from "./Sources";
import AiChatInput from "./AiChatInput";
import askNotes from "../../apis/askNotes";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import SendingLoader from "../Loaders/SendingLoader";
import { Button } from "../ui/button";

const AiChat = ({ setIsAiChatVisible }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // "general" talks to the chat model directly; "notes" answers only from the
  // user's own indexed notes and returns the sources it used.
  const [mode, setMode] = useState("general");
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

  const sendToNotes = async (question) => {
    try {
      const result = await askNotes(question);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: result.answer, sources: result.sources },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            error.response?.data?.error || "Could not reach the notes assistant.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    const question = messageInput.trim();
    if (question === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: question },
    ]);
    setIsLoading(true);
    setMessageInput("");

    // The notes assistant is a plain request/response call; the general chat
    // streams back over the socket and clears the loader in its own handler.
    if (mode === "notes") sendToNotes(question);
    else socket.emit("sendMessage", { content: question });
  };

  return (
    <div className="p-4 bg-gray-950 h-full w-[500px] max-w-[90vw] rounded-md flex flex-col justify-between">
      <div className="flex w-full justify-between items-center">
        <h1 className="font-bold h-[2rem]">AI Chat</h1>
        <div className="flex gap-1">
          {["general", "notes"].map((option) => (
            <Button
              key={option}
              variant={mode === option ? "default" : "ghost"}
              className="h-fit text-xs px-2 py-1"
              onClick={() => setMode(option)}
              disabled={isLoading}
            >
              {option === "general" ? "General" : "My Notes"}
            </Button>
          ))}
        </div>
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
            <Sources sources={msg.sources} />
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
