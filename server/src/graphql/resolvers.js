const { NoteModel } = require("../models/NoteModel");
const { CommentModel } = require("../models/CommentModel");
const { AuthenticationError } = require("apollo-server-express");

const { PubSub } = require("graphql-subscriptions");
const { addNotification } = require("../functions/AddNofitications");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    getCommentsByNoteId: async (_, { noteId }) => {
      try {
        const note = await NoteModel.findById(noteId).populate({
          path: "comments",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "postedBy",
            select: "_id username",
          },
        });

        if (!note) {
          throw new Error("Note not found");
        }

        return note.comments;
      } catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
      }
    },
  },

  Mutation: {
    postComment: async (_, { noteId, comment }, { req }) => {
      const user = req.user;

      if (!user)
        throw new AuthenticationError(
          "You must be logged in to post a comment."
        );

      try {
        const newComment = new CommentModel({
          postedBy: user._id,
          comment,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedComment = await newComment.save();

        const note = await NoteModel.findByIdAndUpdate(
          noteId,
          {
            $push: { comments: savedComment._id },
          },
          { new: true }
        ).populate("postedBy", "_id");

        const populatedComment = await CommentModel.findById(savedComment._id)
          .populate("postedBy", "_id username")
          .exec();

        await addNotification(
          note.postedBy._id,
          `Commented: ${comment}`,
          "post",
          user._id,
          noteId
        );

        pubsub.publish(`COMMENT_ADDED_${noteId}`, {
          commentAdded: populatedComment,
        });

        return populatedComment;
      } catch (error) {
        console.error("Error posting comment:", error);
        throw new Error("Failed to post comment");
      }
    },

    deleteComment: async (_, { commentId, noteId }, { req }) => {
      const user = req.user;
      if (!user) {
        throw new AuthenticationError(
          "You must be logged in to delete a comment."
        );
      }

      try {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
          console.log("No comment");
          throw new Error("Comment not found");
        }

        if (comment.postedBy.toString() !== user._id.toString()) {
          throw new AuthenticationError(
            "You are not authorized to delete this comment."
          );
        }

        await CommentModel.findByIdAndDelete(commentId);

        pubsub.publish(`COMMENT_DELETED_${noteId}`, {
          commentDeleted: {
            success: true,
            message: "Comment deleted successfully",
          },
        });

        return { success: true, message: "Comment deleted successfully" };
      } catch (error) {
        console.error("Error deleting comment:", error);
        return {
          success: false,
          message: "Comment delete unsuccessful",
        };
      }
    },
  },

  Subscription: {
    commentAdded: {
      subscribe: (_, { noteId }) =>
        pubsub.asyncIterator(`COMMENT_ADDED_${noteId}`),
    },
    commentDeleted: {
      subscribe: (_, { noteId }) =>
        pubsub.asyncIterator(`COMMENT_DELETED_${noteId}`),
    },
  },
};

module.exports = { resolvers };
