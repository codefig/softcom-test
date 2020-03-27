const validator = require("validator");
const crypto = require("crypto");

function checkEmptyRequestBody(params, fields) {
  const errors = {};
  fields.forEach(element => {
    if (typeof params[element] === "undefined") {
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
