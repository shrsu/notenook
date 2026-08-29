const {
  authenticateSocketHandshake,
} = require("../middlewares/socketHandshakeAuthentication");

const {
  setSocketUserId,
  deleteSocketUserId,
} = require("../utils/socketIdOperations");

let chatNamespace = null;

function chatSocket(ioNamespace) {
  chatNamespace = ioNamespace;

  chatNamespace.use(authenticateSocketHandshake);

  chatNamespace.on("connection", async (socket) => {
    await setSocketUserId(socket.userId, socket.id);

    socket.emit("connectionSuccess", {
      message: "You have successfully connected to the chat server.",
    });

    socket.on("disconnect", async () => {
      await deleteSocketUserId(socket.userId);
    });
  });
}

module.exports = {
  chatSocket,
  getChatNamespace: () => chatNamespace,
};
