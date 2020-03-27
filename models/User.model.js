const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "agent", "admin"],
    default: "user"
  },
  token: {
    type: String,
    default: null
  },
  reputation: {
    type: Number,
    default: 0
  }
});
userSchema.methods.generateToken = function() {
  const token = jwt.sign(
    { id: this._id, access: this.role },
    config.get("jwtPrivateKey"),
    { expiresIn: "1d" }
  );
  return token;
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
