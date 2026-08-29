const { UserModel } = require("../models/UserModel");
const { FriendRequestModel } = require("../models/FriendRequestModel");
const { validateData } = require("../validation/validator");
const {
  userUpdateJoiSchema,
  passwordUpdateJoiSchema,
} = require("../validation/userJoiSchemas");

// Utility function to handle error responses
const handleError = (res, error) => {
  if (error.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Unauthorized access" });
  } else if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid user ID format" });
  } else if (error.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: "Validation error", details: error.errors });
  } else if (error.code && error.code === 11000) {
    return res
      .status(409)
      .json({ message: "Duplicate key error", details: error.keyValue });
  } else {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    });

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Utility function to find user by ID and populate fields
const findUserByIdAndPopulate = async (userId) => {
  return await UserModel.findById(userId)
    .populate({
      path: "friends",
      select: "username",
    })
    .populate({
      path: "notes",
      select: "title subject updatedAt",
    })
    .populate({
      path: "postedNotes",
      select: "-postedBy",
    });
};

// Utility function to get user data
const getUserData = (user) => ({
  _id: user._id,
  username: user.username,
  fullname: user.fullname,
  email: user.email,
  numberOfNotes: user.notes.length,
  numberOfConnections: user.friends.length,
  friends: user.friends,
  notes: user.notes,
  postedNotes: user.postedNotes,
  avatar: user.avatar,
});

// Utility function to check friendship status
const checkFriendshipStatus = async (authenticatedUserId, userId) => {
  const friendRequest = await FriendRequestModel.findOne({
    $or: [
      { sender: authenticatedUserId, receiver: userId },
      { sender: userId, receiver: authenticatedUserId },
    ],
  });

  let friendshipStatus = "none";

  if (friendRequest) {
    const requestStatus = friendRequest.status;
    if (requestStatus === "pending") {
      if (friendRequest.sender.toString() === authenticatedUserId) {
        friendshipStatus = "pending";
      } else if (friendRequest.receiver.toString() === authenticatedUserId) {
        friendshipStatus = "incoming";
      }
    } else if (requestStatus === "accepted") {
      friendshipStatus = "friends";
    }
  } else {
    const user = await UserModel.findById(userId).populate({
      path: "friends",
      select: "_id username",
    });
    const areFriends = user.friends.some(
      (friend) => friend._id.toString() === authenticatedUserId
    );
    if (areFriends) {
      friendshipStatus = "friends";
    }
  }

  return { friendshipStatus, friendRequestId: friendRequest?._id };
};

const getUserDetails = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWithFriends = await findUserByIdAndPopulate(user._id);

    if (!userWithFriends) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = getUserData(userWithFriends);

    return res.status(200).json({ user: userData });
  } catch (error) {
    return handleError(res, error);
  }
};

const getMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await findUserByIdAndPopulate(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = getUserData(user);
    return res.status(200).json({ user: userData });
  } catch (error) {
    return handleError(res, error);
  }
};

const viewUserDetails = async (req, res) => {
  try {
    const usrId = req.params.userId;
    const authenticatedUserId = req.user.id;

    const user = await findUserByIdAndPopulate(usrId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { friendshipStatus, friendRequestId } = await checkFriendshipStatus(
      authenticatedUserId,
      usrId
    );

    const userData = {
      ...getUserData(user),
      friendshipStatus,
      requestId: friendRequestId,
    };

    return res.status(200).json({ user: userData });
  } catch (error) {
    return handleError(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, fullname, email } = req.body;

    const { error } = validateData(
      { username, fullname, email },
      userUpdateJoiSchema
    );
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    if (username && username !== user.username) {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      if (user.oauthId) {
        return res.status(400).json({
          message: "Cannot change email for accounts signed up using gmail.",
        });
      }
      const existingEmail = await UserModel.findOne({ email });
      if (
        existingEmail &&
        existingEmail._id.toString() !== user._id.toString()
      ) {
        return res.status(400).json({ message: "Email is already taken" });
      }
      user.email = email;
    }

    if (fullname) {
      user.fullname = fullname;
    }

    await user.save();

    res.json({ message: "User data updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, newPassword } = req.body;

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { error } = validateData(
      { password, newPassword },
      passwordUpdateJoiSchema
    );

    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((detail) => detail.message) });
    }

    await user.setPassword(newPassword);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { avatar } = req.body;

    function isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    }
    
    if (!avatar || !isValidUrl(avatar)) {
      return res.status(400).json({ message: "Invalid avatar URL" });
    }

    user.avatar = avatar;
    await user.save();

    res.json({ message: "Avatar updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { searchInput } = req.query;

    if (!searchInput) {
      return res.status(400).json({ message: "Search input is required" });
    }

    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const escapedSearchInput = escapeRegExp(searchInput);

    const query = {
      $and: [
        {
          $or: [
            { fullname: { $regex: escapedSearchInput, $options: "i" } },
            { username: { $regex: escapedSearchInput, $options: "i" } },
          ],
        },
        { _id: { $ne: req.user._id } },
      ],
    };

    const users = await UserModel.find(query).select(
      "fullname username avatar"
    );
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserDetails,
  getMyProfile,
  viewUserDetails,
  updateUser,
  updatePassword,
  updateAvatar,
  searchUsers,
};
