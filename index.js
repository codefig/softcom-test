const express = require("express");
const app = express();
const config = require("config");
const JOi = require("@hapi/joi");
const userRoute = require("./routes/user.route");
const questionsRoute = require("./routes/question.route");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to StackOverflow Test V1");
});

app.use("/user", userRoute);
app.use("/question", questionsRoute);

const environment = config.get("database.connection");
const PORT = process.env.PORT || 3000;
if (!config.has("jwtPrivateKey")) {
  throw new Error("JWT key not set");
  process.exit(1);
}

app.listen(PORT, () => {
  mongoose
    .connect(environment)
    .then(result => {
      console.log("Database connected successfully");
    })
    .catch(err => {
      throw new Error("Database Connection Error : " + err);
    });
  console.log("Application started on ", PORT);
});
