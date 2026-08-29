import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, gql, useSubscription } from "@apollo/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";

import Comment from "./Comment";
import MyComment from "./MyComment";
import CommentInput from "./CommentInput";
import ActionLoader from "../Loaders/ActionLoader";

import { UserContext } from "../../context/userContext";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

const GET_COMMENTS_BY_NOTE_ID = gql`
  query GetCommentsByNoteId($noteId: ID!) {
    getCommentsByNoteId(noteId: $noteId) {
      _id
      postedBy {
        _id
        username
      }
      comment
      updatedAt
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!, $noteId: ID!) {
    deleteComment(commentId: $commentId, noteId: $noteId) {
      success
      message
    }
  }
`;

const COMMENT_ADDED = gql`
  subscription CommentAdded($noteId: ID!) {
    commentAdded(noteId: $noteId) {
      _id
      postedBy {
        _id
        username
      }
      comment
      updatedAt
    }
  }
`;

const COMMENT_DELETED = gql`
  subscription CommentDeleted($noteId: ID!) {
    commentDeleted(noteId: $noteId) {
      success
      message
    }
  }
`;

function CommentsWindow({ setTab }) {
  const { user } = useContext(UserContext);
  const { documentId: noteId } = useParams();

  const { loading, error, data, refetch } = useQuery(GET_COMMENTS_BY_NOTE_ID, {
    variables: { noteId },
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
    onCompleted: () => {
      refetch();
    },
  });

  const { data: addedCommentData } = useSubscription(COMMENT_ADDED, {
    variables: { noteId },
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
  });

  const { data: deletedCommentData } = useSubscription(COMMENT_DELETED, {
    variables: { noteId },
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
  });

  useEffect(() => {
    if (addedCommentData || deletedCommentData) {
      refetch();
    }
  }, [addedCommentData, deletedCommentData, refetch]);

  if (loading) {
    return <ActionLoader action={"Loading comments..."} />;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        {error.message}
      </p>
    );
  }

  const comments = data.getCommentsByNoteId;
  const myComments = comments.filter(
    (comment) => comment.postedBy?._id === user?._id
  );

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ variables: { commentId, noteId } });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentPosted = () => {
    refetch();
  };

  return (
    <Tabs
      defaultValue="all"
      className="flex page commentWindow flex-col w-full justify-between items-center absolute pb-0 left-0 top-0 backdrop-blur-sm"
    >
      <div className="flex justify-between items-center h-[75px] w-[500px] max-w-[95vw] mb-2">
        <TabsList
          style={{
            backgroundColor: "#09090b",
          }}
        >
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="my">My</TabsTrigger>
        </TabsList>
        <Button
          onClick={() => {
            setTab("post");
          }}
          className="text-xs h-fit"
        >
          Close
        </Button>
      </div>
      <div className="comments h-[calc(100%-150px)] justify-stretch overflow-y-scroll w-[500px] max-w-[90vw] rounded-md flex flex-col">
        <TabsContent value="all">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))
          ) : (
            <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-sm text-neutral-300 text-center">
              No comments yet.....
            </p>
          )}
        </TabsContent>
        <TabsContent value="my">
          {myComments.length > 0 ? (
            myComments.map((comment) => (
              <MyComment
                key={comment._id}
                comment={comment}
                deleteComment={handleDeleteComment}
              />
            ))
          ) : (
            <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-sm text-neutral-300 text-center">
              You haven't commented yet....
            </p>
          )}
        </TabsContent>
      </div>
      <div className="w-[500px] max-w-[95vw] h-[75px] mt-2">
        <CommentInput
          noteId={noteId}
          handleCommentPosted={handleCommentPosted}
        />
      </div>
    </Tabs>
  );
}

export default CommentsWindow;
