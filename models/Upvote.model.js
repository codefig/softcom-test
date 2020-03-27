const mongoose = require("mongoose");

const upvoteSchema = new mongoose.Schema({
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
upvoteSchema.index({ questionId: 1, userId: 1 }, { unique: true });
const Upvote = mongoose.model("Upvotes", upvoteSchema);
module.exports = Upvote;
