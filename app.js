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


var allowlist = ["http://localhost:3000", "http://192.168.8.198:3000"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: true,
      optionsSuccessStatus: 200, 
      credentials: true,
    }; 
  } else {
    corsOptions = { origin: false }; 
  }
  callback(null, corsOptions); 
};

app.use(cors(corsOptionsDelegate));

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
