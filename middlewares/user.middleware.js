const Response = require("../services/response_manager");
const httpStatus = require("../services/http_status");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User.model");

async function isAuthenticatedUser(req, res, next) {
  const token = req.header("x-auth-token");
  if (token === undefined || token.length == 0) {
    return Response.failure(
      res,
      {
        message: "failure",
        response: {
          token: "Invalid authentication token"
        }
      },
      httpStatus.BAD_REQUEST
    );
  }
  //then check for the user with that ID using the token;
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    const user = await User.findById({ _id: decoded.id });
    if (!user) {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            token: "Unauthorized user"
          }
        },
        httpStatus.UNAUTHORIZED
      );
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return Response.failure(
        res,
        {
          message: "failure",
          response: {
            token: "Token expired"
          }
        },
        httpStatus.BAD_REQUEST
      );
    } else {
      return Response.failure(res, {
        message: "failure",
        response: {
          token: "Invalid Authentication token"
        }
      });
    }
  }
}

module.exports.isAuthenticatedUser = isAuthenticatedUser;
