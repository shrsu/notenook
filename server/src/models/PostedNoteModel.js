const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postedNoteSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, minlength: 3 },
    subject: { type: String, required: true, minlength: 3 },
    note: { type: Schema.Types.ObjectId, ref: "Note", required: true },
  },
  { timestamps: true }
);

const PostedNoteModel = mongoose.model("PostedNote", postedNoteSchema);

module.exports = { PostedNoteModel };
