const { textEditorSocket } = require("./textEditorSocket");
const { chatSocket } = require("./chatSocket");
const { aiChatSocket } = require("./aiChatSocket");

const setupSockets = (io) => {
  const textEditorNamespace = io.of("/text-editor");
  textEditorSocket(textEditorNamespace);

  const chatNamespace = io.of("/chat");
  chatSocket(chatNamespace);

  const aiChatNamespace = io.of("/aiChat");
  aiChatSocket(aiChatNamespace);
};

module.exports = { setupSockets };
