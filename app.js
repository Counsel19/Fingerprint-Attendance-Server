const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//setup express app
const app = express();

//require user model
const Users = require("./models/userSchema");

//MIDDLEWARES
//Get data and cokies from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  })
);

//Confingure env file and require connection file
dotenv.config({ path: "./config.env" });
require("./db/conn");
const port = process.env.PORT;

//use user routes
app.use("/auth", require("./routes/index"));
app.use("/api/users", require("./routes/users"));
app.use("/api/students", require("./routes/students"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/courses", require("./routes/courses"));

app.listen(port, () => {
  console.log("Server is Listening...");
});
