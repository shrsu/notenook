const { ChatModel } = require("../models/ChatModel");
const { MessageModel } = require("../models/MessageModel");
const { UserModel } = require("../models/UserModel");
const { getChatNamespace } = require("../socketHandlers/chatSocket");
const { getUserSocketId } = require("../utils/socketIdOperations");

const getUsersForChat = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id)
      .populate({
        path: "chats",
        populate: {
          path: "participants",
          select: "username avatar",
        },
        options: { sort: { updatedAt: -1 } },
      })
      .populate({
        path: "friends",
        select: "username avatar",
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friends = user.friends;
    const participants = user.chats.reduce((acc, chat) => {
      chat.participants.forEach((participant) => {
        if (participant._id.toString() !== req.user._id.toString()) {
          acc.add(
            JSON.stringify({
              _id: participant._id.toString(),
              username: participant.username,
              avatar: participant.avatar,
            })
          );
        }
      });
      return acc;
    }, new Set());

    const filteredUsers = Array.from(participants).map((participant) =>
      JSON.parse(participant)
    );

    res.status(200).json({ users: filteredUsers, friends });
  } catch (error) {
    console.error("Error in getUsersForChat: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    let chat = await ChatModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new ChatModel({
        participants: [senderId, receiverId],
      });
      await chat.save();
      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: { chats: chat._id },
      });
      await UserModel.findByIdAndUpdate(receiverId, {
        $push: { chats: chat._id },
      });

      const chatNamespace = getChatNamespace();

      const receiverSocketId = await getUserSocketId(receiverId);

      if (chatNamespace && receiverSocketId) {
        chatNamespace.to(receiverSocketId).emit(
          "newChatCreated",
          {
            chatId: chat._id,
            senderId,
            senderUsername: req.user.username,
          },
          (error) => {
            if (error) {
              console.error("Error emitting newChatCreated:", error);
            }
          }
        );
      }
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      chatId: chat._id,
      message: message,
      timestamp: new Date(),
    });

    await newMessage.save();

    await ChatModel.findByIdAndUpdate(chat._id, {
      $push: { messages: newMessage._id },
    });

    const chatNamespace = getChatNamespace();
    const receiverSocketId = await getUserSocketId(receiverId);

    if (chatNamespace && receiverSocketId) {
      chatNamespace
        .timeout(5000)
        .to(receiverSocketId)
        .emit("receiveMessage", newMessage, (err, responses) => {
          if (err) {
            console.error("Error emitting receiveMessage:", err);
          }
        });
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userToChatId } = req.params;
    const senderId = req.user._id;

    const chat = await ChatModel.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    const userToChat = await UserModel.findById(userToChatId).select({
      username: 1,
      _id: 1,
      avatar: 1,
    });

    if (!chat)
      return res.status(200).json({
        messages: [],
        userToChat: { username: userToChat.username, _id: userToChat._id },
      });

    const messages = chat.messages;

    if (!userToChat) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      messages,
      userToChat: {
        username: userToChat.username,
        _id: userToChat._id,
        avatar: userToChat.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getUsersForChat,
  sendMessage,
  getMessages,
};
