import { IoSend } from "react-icons/io5";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";

import SendingLoader from "../Loaders/SendingLoader";

const AiChatInput = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  isLoading,
}) => {
  return (
    <div className="flex absolute w-[95%] gap-1 min-[900px]:ml-0 min-[900px]:relative min-[900px]:w-full min-[900px]:bottom-0">
      <Textarea
        className="text-black resize-none"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
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
            onClick={handleSendMessage}
            className="h-[50px] aspect-square rounded-full"
          >
            <IoSend className="text-xl" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AiChatInput;
