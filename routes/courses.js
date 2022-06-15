const express = require("express");
const router = express.Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

const Courses = require("../models/courses");

router.get("/", verifyTokenAndAdmin, (req, res) => {
  Courses.find(function (error, docs) {
    if (!error) {
      res.status(200).json(docs);
    } else {
      console.error(error);
    }
  });
});

router.get("/user/:id", verifyTokenAndAuthorization, (req, res) => {
  Courses.find(function (error, docs) {
    if (!error) {
      res.status(200).json(docs);
    } else {
      console.error(error);
    }
  });
});

router.get(
  "/:course_code/user/:id",
  verifyTokenAndAuthorization,
  (req, res) => {
    try {
      Courses.findOne(
        { course_code: req.params.course_code },
        function (error, courseDoc) {
          if (!error) {
            res.status(200).json(courseDoc);
          } else {
            console.log(error);
          }
        }
      );
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  }
);

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    //Get body or Data
    const createCourse = new Courses({
      course_code: req.body.course_code,
      course_title: req.body.course_title,
      num_students_offering: req.body.num_students_offering,
      course_lecturers: req.body.course_lecturers,
    });

    const created = await createCourse.save();

    res.status(200).json("Course Created");
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

module.exports = router;
