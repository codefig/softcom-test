const express = require("express");
const _ = require("lodash");
const router = express.Router();
const Response = require("../services/response_manager");
const httpStatus = require("../services/http_status");
const Utils = require("../services/utilities");
const Question = require("../models/Question.model");
const { Answer } = require("../models/Answer.model");
const Upvote = require("../models/Upvote.model");
const Downvote = require("../models/Downvote.model");

router.post("/ask", async (req, res) => {
  try {
    let errors = Utils.checkEmptyRequestBody(req.body, [
      "userId",
      "title",
      "body"
    ]);
    if (Object.keys(errors).length !== 0) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: errors
        },
        httpStatus.BAD_REQUEST
      );
    }
    const question = await Question(req.body).save();
    return Response.success(
      res,
      {
        message: "success",
        response: {
          question: question
        }
      },
      httpStatus.OK
    );
  } catch (error) {
    if (error && error.code === 11000) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            question: "Duplicate entry, A similar question already asked"
          }
        },
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return Response.failure(
      res,
      {
        message: "failure",
        response: error
      },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});
router.post("/answer", async (req, res) => {
  try {
    let errors = Utils.checkAnswerRequestContent(req.body, [
      "userId",
      "questionId",
      "body"
    ]);
    if (Object.keys(errors).length !== 0) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: errors
        },
        httpStatus.BAD_REQUEST
      );
    }
    let question = await Question.findById(req.body.questionId);
    let previousAnswers = question.answers;
    if (!question) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            question: "Question not found"
          }
        },
        httpStatus.BAD_REQUEST
      );
    }
    let answer = new Answer(req.body);
    let userAnsBeforeCount = 0;
    previousAnswers.forEach((item, index) => {
      if (item["userId"] == req.body.userId) {
        userAnsBeforeCount += 1;
      }
    });
    if (userAnsBeforeCount != 0) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            question:
              "Duplicate entry, User already posted an answer on this question"
          }
        },
        httpStatus.BAD_REQUEST
      );
    }
    question.answers.push(answer);
    question.save();
    return Response.success(
      res,
      {
        message: "success",
        response: {
          answer: answer
        }
      },
      httpStatus.OK
    );
  } catch (error) {
    return Response.failure(
      res,
      {
        message: "failure",
        response: error
      },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

router.post("/upvote", async (req, res) => {
  try {
    const errors = Utils.checkEmptyRequestBody(req.body, [
      "questionId",
      "userId"
    ]);
    if (Object.keys(errors).length !== 0) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: errors
        },
        httpStatus.BAD_REQUEST
      );
    }
    const upvote = await Upvote(req.body).save();
    const question = await Question.findOneAndUpdate(
      { _id: req.body.questionId },
      { $inc: { upvote: 1 } },
      { new: true }
    );
    if (!question) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            upvote: "Invalid question Id"
          }
        },
        httpStatus.NOT_FOUND
      );
    } else {
      return Response.success(
        res,
        {
          message: "success",
          response: {
            question: question
          }
        },
        httpStatus.OK
      );
    }
  } catch (error) {
    if (error && error.code === 11000) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            question: "Duplicate entry, Question already upvoted by this user"
          }
        },
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return Response.failure(
      res,
      {
        message: "failure",
        response: error
      },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

router.post("/downvote", async (req, res) => {
  try {
    const errors = Utils.checkEmptyRequestBody(req.body, ["questionId"]);
    if (Object.keys(errors).length !== 0) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: errors
        },
        httpStatus.BAD_REQUEST
      );
    }
    const downvote = await Downvote(req.body).save();
    const question = await Question.findOneAndUpdate(
      { _id: req.body.questionId },
      { $inc: { downvote: 1 } },
      { new: true }
    );
    if (!question) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            downvote: "Invalid question Id"
          }
        },
        httpStatus.NOT_FOUND
      );
    } else {
      return Response.success(
        res,
        {
          message: "success",
          response: {
            question: question
          }
        },
        httpStatus.OK
      );
    }
  } catch (error) {
    if (error && error.code === 11000) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            question: "Duplicate entry, Question already downvoted by this user"
          }
        },
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return Response.failure(
      res,
      {
        message: "failure",
        response: error
      },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

router.get("/search", async (req, res) => {
  try {
    const errors = Utils.checkEmptyRequestBody(req.query, ["query"]);
    if (Object.keys(errors).length != 0) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: errors
        },
        httpStatus.BAD_REQUEST
      );
    }
    const question = await Question.find({ title: req.query.query });
    if (!question) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            question: ""
          }
        },
        httpStatus.NO_CONTENT
      );
    }
    return Response.success(
      res,
      {
        message: "success",
        response: {
          question: question
        }
      },
      httpStatus.OK
    );
  } catch (error) {
    return Response.failure(
      res,
      {
        message: "failure",
        response: error
      },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

module.exports = router;
