const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  text: {
    type: String,
    required: true
  },
  upvote: {
    type: Number,
    default: 0
  },
  downvote: {
    type: Number,
    default: 0
  },
  timestamp: Date.now()
});

const Answers = new mongoose.model("Answers", answerSchema);
module.exports = Answers;
