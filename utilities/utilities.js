const validator = require("validator");
const crypto = require("crypto");

function checkEmptyRequestBody(params, fields) {
  const errors = {};
  fields.forEach(element => {
    if (typeof params[element] === "undefined") {
      errors[element] = element + " is required";
    }
  });
  //   console.log(errors);
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

  if (validator.isLength(params["phoneNumber"], { min: 0, max: 10 })) {
    errors["phoneNumber"] = "Invalid phone number specified";
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

function checkPasswordRecoveryRequest(params) {
  const errors = {};
  if (typeof params["token"] === "undefined") {
    errors["token"] = "Invalid recovery token specified";
  }
  if (
    typeof params["password"] === "undefined" ||
    validator.isLength(params["password"], { min: 0, max: 5 })
  ) {
    errors["password"] = "Password should be at least 6 xters long";
  }
  return errors;
}

function isValidEmail(param) {
  let email = param;
  if (!email) return false;
  if (email.length === 0) return false;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
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
module.exports.checkPasswordRecoveryRequest = checkPasswordRecoveryRequest;
