const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  answers: {
    type: Array,
    default: null
  },
  upvote: {
    type: Number,
    default: 0
  },
  downvote: {
    type: Number,
    default: 0
  },
  text: {
    type: String,
    index: true,
    unique: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  timestamp: Date.now()
});

const Question = new mongoose.model("Questions", questionSchema);
module.exports = Question;
