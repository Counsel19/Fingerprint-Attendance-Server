const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { verifyToken } = require("../middleware/authMiddleware");

//Reqiure Model
const Users = require("../models/userSchema");

router.get("/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.status(200).send("User Logged Out");
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    //find user is Exist
    const user = await Users.findOne({
      email: email,
    });

    if (user) {
      const isMatch = await bcryptjs.compare(password, user.password);

      if (isMatch) {
        //Generate Token which is defined in users Schema
        const token = await user.generateToken();

        res.cookie("jwt", `Bearer ${token}`, {
          //Token Expires in 24hrs
          expires: new Date(Date.now() + 86400000),
          httpOnly: true,
          sameSite: "none",
          secure: true
        });
        const { password, ...others } = user;

        res.status(200).json({ status: 200, data: { ...others } });
      } else {
        res.status(400).json({
          status: 400,
          message: "Password Incorrect",
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "Invalid Email",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 200,
      message: error.message,
    });
    console.log(error);
  }
});

router.get("/request-login", verifyToken, async (req, res) => {
  if (req.user._id) {
    const user = await Users.findOne({
      _id: req.user._id,
    });

    if (user) {
      const { password, tokens, __v, ...others } = user._doc;

      res.status(200).json(others);
    }
  }
});

module.exports = router;
