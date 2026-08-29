import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";

import { IoSend } from "react-icons/io5";

import SendingLoader from "../Loaders/SendingLoader";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

const POST_COMMENT = gql`
  mutation PostComment($noteId: ID!, $comment: String!) {
    postComment(noteId: $noteId, comment: $comment) {
      _id
      comment
      postedBy {
        _id
        username
      }
      updatedAt
    }
  }
`;

const CommentInput = ({ handleCommentPosted }) => {
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { documentId } = useParams();

  const [postComment] = useMutation(POST_COMMENT, {
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
    onCompleted: () => {
      handleCommentPosted();
      setMessageInput("");
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error posting comment:", error);
      setIsLoading(false);
    },
  });

  const handleSendMessage = async () => {
    setIsLoading(true);

    try {
      await postComment({
        variables: { noteId: documentId, comment: messageInput },
      });
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="flex gap-1 ml-[55px] mr-2 mt-4">
      <Textarea
        value={messageInput}
        className="text-black resize-none"
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your comment here..."
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

export default CommentInput;
