const mongoose = require("mongoose");

const downvoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    required: true
  }
});
downvoteSchema.index({ questionId: 1, userId: 1 }, { unique: true });
const Downvote = mongoose.model("Downvotes", downvoteSchema);
module.exports = Downvote;
