const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  body: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});
answerSchema.index({ questionId: 1, userId: 1, body: 1 });
const Answer = new mongoose.model("Answers", answerSchema);
module.exports.answerSchema = answerSchema;
module.exports.Answer = Answer;
