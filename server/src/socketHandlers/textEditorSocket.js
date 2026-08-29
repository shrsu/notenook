const { NoteModel } = require("../models/NoteModel");
const {
  authenticateSocketHandshake,
} = require("../middlewares/socketHandshakeAuthentication");
const { isOwner } = require("../utils/verifyNoteAuthor");

function textEditorSocket(io) {
  io.use(authenticateSocketHandshake);

  io.on("connection", (socket) => {
    console.log("connected to text-editor socket...");

    socket.on("get-document", async (documentId) => {
      const userId = socket.userId;

      try {
        const note = await NoteModel.findById(documentId);

        if (!note) {
          socket.emit("document-not-found", "Document not found");
          return;
        }

        if (!isOwner(userId, note.postedBy)) {
          throw new Error("Unauthorized: You are not the author of this note");
        }

        socket.emit("load-document", note.document);

        socket.on("save-document", async (data) => {
          try {
            await NoteModel.findByIdAndUpdate(documentId, {
              document: data,
            });
            socket.emit("document-saved", "Document saved successfully");
          } catch (error) {
            console.error("Error saving document:", error.message);
            socket.emit("document-save-error", "Error saving document");
          }
        });
      } catch (error) {
        console.error("Error fetching document:", error.message);

        if (error.message.includes("Unauthorized")) {
          socket.emit("authorization-error", error.message);
        } else {
          socket.emit("document-fetch-error", "Error fetching document");
        }
      }
    });
  });
}

module.exports = { textEditorSocket };
