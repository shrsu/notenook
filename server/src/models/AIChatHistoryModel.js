const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AIchatHistorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "AIChatMessage",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

AIchatHistorySchema.pre("save", function (next) {
  if (this.messages.length > 10) {
    this.messages = this.messages.slice(-10);
  }
  next();
});

const AIChatHistoryModel = mongoose.model("AIChatHistory", AIchatHistorySchema);

module.exports = { AIChatHistoryModel };
