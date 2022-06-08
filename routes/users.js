const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");
const bcryptjs = require("bcryptjs");

//Reqiure Model
const Users = require("../models/userSchema");

router.get("/", verifyTokenAndAdmin, (req, res) => {
  Users.find(function (error, docs) {
    if (!error) {
      res.status(200).json(docs);
    } else {
      console.error(error);
    }
  });
});

router.get("/:id", verifyTokenAndAuthorization, (req, res) => {
  try {
    Users.findOne({ _id: req.params.id }, function (error, userDoc) {
      if (!error) {
       if(userDoc.length !== 0) {
        const { password, tokens, __v, ...others } = userDoc._doc;
        res.status(200).json(others);
       }else{
         res.status(400).json("Invalid Credentials")
       }
      } else {
        console.log(error);
      }
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.put(
  "/:id/change-password",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const user = await Users.findOne({
        _id: req.params.id,
      });

      if (req.body.currentPassword) {
        const isMatch = await bcryptjs.compare(
          req.body.currentPassword,
          user.password
        );

        if (isMatch) {
        
          if (req.body.newPassword) {
            req.body.password = bcryptjs.hashSync(req.body.newPassword, 10);

            const updatedUser = await Users.findByIdAndUpdate(
              req.params.id,
              { password: req.body.password },
              {
                new: true,
              }
            );
            res.status(200).json(updatedUser);
          } else {
            res.status(400).json("Field(s) Missing");
          }
        } else {
          res.status(400).json("Current Password Incorrect");
        }
      } else {
        res.status(400).json("Field(s) Missing");
      }
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  }
);

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const uploader = async (path) =>
      await cloudinary.uploads(path, "ProfileImage");
    if (req.body.image) {
      const fileStr = req.body.image;

      const { secure_url, public_id } = await uploader(fileStr);
      const edittedUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        department: req.body.department,
        faculty: req.body.faculty,
        rank: req.body.rank,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        courses: req.body.courses,
        avatar: secure_url,
        cloudinary_id: public_id,
      };

      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        { $set: edittedUser },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } else {
      const edittedUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        department: req.body.department,
        faculty: req.body.faculty,
        rank: req.body.rank,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        courses: req.body.courses,
      };

      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        { $set: edittedUser },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

router.delete("/:id", verifyTokenAndAdmin, (req, res) => {
  try {
    Users.findByIdAndRemove({ _id: req.params.id }, function (error, doc) {
      if (!error) {
        res.status(204).json({
          message: "Success",
        });
      }
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

//Creating new Lecturer
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const uploader = async (path) =>
      await cloudinary.uploads(path, "ProfileImage");
    if (req.body.image) {
      const fileStr = req.body.image;

      const { secure_url, public_id } = await uploader(fileStr);
      //Get body or Data
      const createUser = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        department: req.body.department,
        faculty: req.body.faculty,
        rank: req.body.rank,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        gender: req.body.gender,
        courses: req.body.courses,
        avatar: secure_url,
        cloudinary_id: public_id,
      });

      const created = await createUser.save();

      res.status(200).send("User Created");
    } else {
      //Get body or Data
      const createUser = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        department: req.body.department,
        faculty: req.body.faculty,
        rank: req.body.rank,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        gender: req.body.gender,
        courses: req.body.courses,
      });

      const created = await createUser.save();

      res.status(200).send("User Created");
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

module.exports = router;
