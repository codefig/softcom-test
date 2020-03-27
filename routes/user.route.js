const express = require("express");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const Response = require("../services/response_manager");
const httpStatus = require("../services/http_status");
const Utils = require("../services/utilities");
const User = require("../models/User.model");
const Question = require("../models/Question.model");
const { Answer } = require("../models/Answer.model");
const Upvote = require("../models/Upvote.model");
const Downvote = require("../models/Downvote.model");

const { isAuthenticatedUser } = require("../middlewares/user.middleware");

router.post("/register", (req, res) => {
  let errResult = Utils.checkEmptyRequestBody(req.body, [
    "name",
    "email",
    "password"
  ]);

  if (Object.keys(errResult).length !== 0) {
    return Response.failure(
      res,
      {
        message: "failure",
        response: errResult
      },
      httpStatus.BAD_REQUEST
    );
  }

  errResult = Utils.checkRequestContent(req.body);
  if (Object.keys(errResult).length !== 0) {
    return Response.failure(
      res,
      {
        message: "failure",
        response: errResult
      },
      httpStatus.BAD_REQUEST
    );
  }
  User.findOne({
    email: req.body.email
  }).then(result => {
    if (result) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            phoneNumber: "A user already exist with this credentials"
          }
        },
        httpStatus.BAD_REQUEST
      );
    } else {
      let user = User(req.body);
      bcrypt
        .genSalt(10)
        .then(salt => {
          return bcrypt.hash(req.body.password, salt);
        })
        .then(hashedPassword => {
          (user.password = hashedPassword),
            (token = jwt.sign(
              { id: user._id.toHexString(), access: "basic" },
              config.get("jwtPrivateKey"),
              { algorithm: "HS256" }
            ));
          user.save().then(userResult => {
            res.setHeader("x-auth-token", token);
            return Response.success(
              res,
              {
                message: "success",
                response: _.omit(userResult._doc, ["password", "token"])
              },
              httpStatus.OK
            );
          });
        })
        .catch(error => {
          const errorMessage = { email: "Email account already exist" };
          const errorHeader =
            error.code === 11000 && error.errmsg.includes("email")
              ? httpStatus.BAD_REQUEST
              : httpStatus.INTERNAL_SERVER_ERROR;
          return Response.failure(
            res,
            {
              message: "failure",
              response:
                error.code === 11000 && error.errmsg.includes("email")
                  ? errorMessage
                  : error.errmsg
            },
            errorHeader
          );
        });
    }
  });
});

router.post("/login", (req, res) => {
  let loggedUser;
  let loginErrors = Utils.checkEmptyRequestBody(req.body, [
    "email",
    "password"
  ]);
  if (Object.keys(loginErrors).length !== 0) {
    return Response.failure(
      res,
      {
        message: "failure",
        response: loginErrors
      },
      httpStatus.BAD_REQUEST
    );
  }
  loginErrors = Utils.checkLoginRequestContent(req.body);
  if (Object.keys(loginErrors).length !== 0) {
    return Response.failure(
      res,
      {
        message: "failure",
        response: loginErrors
      },
      httpStatus.BAD_REQUEST
    );
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      loggedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(comparedResult => {
      if (!comparedResult) {
        return Response.failure(
          res,
          {
            message: "failure",
            response: { email: "Invalid Login credentials" }
          },
          httpStatus.FORBIDDEN
        );
      }
      res.setHeader("x-auth-token", loggedUser.generateToken());
      return Response.success(res, {
        message: "success",
        response: _.omit(loggedUser._doc, ["password", "token"])
      });
    })
    .catch(err => {
      return Response.failure(
        res,
        {
          message: "failure",
          response: { email: "Invalid Login credentials" }
        },
        httpStatus.FORBIDDEN
      );
    });
});

router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    return Response.success(
      res,
      {
        message: "success",
        response: {
          question: questions
        }
      },
      httpStatus.OK
    );
  } catch (error) {
    return Response.failure(res, {
      message: "failure",
      response: error
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const errors = Utils.checkEmptyRequestBody(req.query, ["name"]);
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
    const user = await User.findOne({ name: req.query.name });
    if (!user) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            user: "No user found"
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
          user: user
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
