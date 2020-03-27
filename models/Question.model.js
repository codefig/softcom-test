const mongoose = require("mongoose");

const { answerSchema } = require("./Answer.model");

const questionSchema = mongoose.Schema({
  title: {
    type: String,
    index: true,
    unique: true
  },
  body: {
    type: String,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  answers: {
    type: Array,
    default: [answerSchema]
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

const Question = new mongoose.model("Questions", questionSchema);
module.exports = Question;
