const validator = require("validator");
const crypto = require("crypto");
const ObjectId = require("mongoose").Types.ObjectId;
function checkEmptyRequestBody(params, fields) {
  const errors = {};
  fields.forEach(element => {
    if (typeof params[element] === "undefined" || params[element] === "") {
      errors[element] = element + " is required";
    }
  });
  return errors;
}

function checkRequestContent(params) {
  const errors = {};
  if (!validator.isEmail(params["email"])) {
    errors["email"] = "Invalid email address specified";
  }
  if (
    validator.isAlphanumeric(params.name) ||
    validator.isLength(params.name, { min: 0, max: 3 })
  ) {
    errors["name"] = "Invalid name specified";
  }
  if (validator.isLength(params["password"], { min: 0, max: 5 })) {
    errors["password"] = "Password should be at least 6 xters long";
  }
  return errors;
}

function checkLoginRequestContent(params) {
  const errors = {};
  if (!validator.isEmail(params["email"])) {
    errors["email"] = "Invalid email address specified";
  }
  if (validator.isLength(params["password"], { min: 0, max: 5 })) {
    errors["password"] = "Password should be at least 6 xters long";
  }
  return errors;
}

function checkAnswerRequestContent(params) {
  const errors = {};
  if (!ObjectId.isValid(params.userId)) {
    errors["userId"] = "invalid userId string";
  }
  if (!ObjectId.isValid(params.questionId)) {
    errors["questionId"] = "Invalid question id ";
  }
  if (params.body === "" || !validator.isLength(params.body, { min: 30 })) {
    errors["body"] = "Answers body should be more than 30 characters";
  }
  return errors;
}

function generateHash() {
  let current_date = new Date().valueOf().toString();
  let random = Math.random().toString();
  return crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
}
module.exports.checkEmptyRequestBody = checkEmptyRequestBody;
module.exports.checkRequestContent = checkRequestContent;
module.exports.checkLoginRequestContent = checkLoginRequestContent;
module.exports.generateHash = generateHash;
module.exports.checkAnswerRequestContent = checkAnswerRequestContent;
