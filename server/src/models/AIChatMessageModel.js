const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AIchatMessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AIChatMessageModel = mongoose.model("AIChatMessage", AIchatMessageSchema);

module.exports = { AIChatMessageModel };
