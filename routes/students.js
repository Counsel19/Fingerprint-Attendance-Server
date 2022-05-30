const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");
const cloudinary = require("../utils/cloudinary");

const Students = require("../models/students");

router.get("/", verifyTokenAndAdmin, (req, res) => {
  Students.find(function (error, docs) {
    if (!error) {
      res.status(200).json(docs);
    } else {
      console.error(error);
    }
  });
});

router.get("/:id", verifyTokenAndAuthorization, (req, res) => {
  if (req.query.studentId) {
    Students.findOne(
      { _id: req.query.studentId },
      function (error, studentDoc) {
        if (!error) {
          res.status(200).json(studentDoc);
        } else {
          console.log(error);
        }
      }
    );
  } else {
    Students.find(function (error, docs) {
      if (!error) {
        res.status(200).json(docs);
      } else {
        console.error(error);
      }
    });
  }
});

router.get(
  "/:id/reg-number/:reg_number",
  verifyTokenAndAuthorization,
  (req, res) => {
    try {
      Students.findOne(
        { reg_number: req.params.reg_number },
        function (error, studentDoc) {
          if (!error) {
            res.status(200).json(studentDoc);
          } else {
            console.log(error);
          }
        }
      );
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  }
);

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    //Get body or Data
    const uploader = async (path) =>
      await cloudinary.uploads(path, "StudentProfileImage");
    if (req.body.image) {
      const fileStr = req.body.image;

      const { url, id } = await uploader(fileStr);
      const createStudent = new Students({
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        reg_number: req.body.reg_number,
        faculty: req.body.faculty,
        department: req.body.department,
        gender: req.body.gender,
        level: req.body.level,
        fingerprint: req.body.fingerprint,
        avatar: url,
        cloudinary_id: id,
      });

      console.log(createStudent);

      const created = await createStudent.save();

      res.status(200).send("User Created");
    } else {
      const createStudent = new Students({
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        reg_number: req.body.reg_number,
        faculty: req.body.faculty,
        department: req.body.department,
        gender: req.body.gender,
        level: req.body.level,
        fingerprint: req.body.fingerprint,
      });

      console.log(createStudent);

      const created = await createStudent.save();

      res.status(200).send("User Created");
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

module.exports = router;
