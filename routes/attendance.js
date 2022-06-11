const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

const Attendance = require("../models/attendance");

router.get("/", (req, res) => {
  Attendance.find(function (error, attendanceDoc) {
    if (!error) {
      if (attendanceDoc) {
        res.status(200).json(attendanceDoc);
      } else {
        res.status(400).json("Error");
      }
    } else {
      console.error(error);
    }
  });
});

router.get("/:id", verifyTokenAndAuthorization, (req, res) => {
  try {
    Attendance.findOne(
      { _id: req.query.attendanceId },
      function (error, attendanceDoc) {
        if (!error) {
          if (attendanceDoc) {
            res.status(200).json(attendanceDoc);
          } else {
            res.status(400).json("Invalid Credentials");
          }
        } else {
          console.log(error);
        }
      }
    );
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.get("/user/:id", verifyTokenAndAuthorization, (req, res) => {
  try {
    Attendance.find(
      { user_docId: req.params.id },
      function (error, attendanceDoc) {
        if (!error) {
          res.status(200).json(attendanceDoc);
        } else {
          console.log(error);
        }
      }
    );
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.get(
  "/user/:id/course/:course",
  verifyTokenAndAuthorization,
  (req, res) => {
    try {
      Attendance.find(
        { user_docId: req.params.id, course: req.params.course },
        function (error, attendanceDoc) {
          if (!error) {
            res.status(200).json(attendanceDoc);
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

router.get(
  "/user/:id/course/:course/student/:student_id",
  verifyTokenAndAuthorization,
  (req, res) => {
    try {
      Attendance.find(
        {
          user_docId: req.params.id,
          course: req.params.course,
          students_present: req.params.student_id,
        },
        function (error, attendanceDoc) {
          if (!error) {
            res.status(200).json(attendanceDoc);
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

router.get("/after/:date", verifyTokenAndAdmin, (req, res) => {
  try {
    Attendance.find(
      { date: { $gte: req.params.date } },
      function (error, attendanceDoc) {
        if (!error) {
         
            res.status(200).json(attendanceDoc);
          
        } else {
          console.log(error);
        }
      }
    );
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.get(
  "/after/:after_date/before/:before_date",
  verifyTokenAndAdmin,
  (req, res) => {
    try {
      Attendance.find(
        { date: { $gte: req.params.after_date, $lte: req.params.before_date } },
        function (error, attendanceDoc) {
          if (!error) {
            res.status(200).json(attendanceDoc);
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

router.get(
  "/user/:id/after/:after_date/before/:before_date",
  verifyTokenAndAdmin,
  (req, res) => {
    try {
      Attendance.find(
        {
          date: { $gte: req.params.after_date, $lte: req.params.before_date },
          user_docId: req.params.id,
        },
        function (error, attendanceDoc) {
          if (!error) {
            res.status(200).json(attendanceDoc);
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

router.post("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    //Get body or Data
    const createAttendance = new Attendance({
      user_docId: req.body.user_docId,
      course: req.body.course,
      semester: req.body.semester,
      session: req.body.session,
      date: req.body.date,
      students_present: req.body.students_present,
    });

    const created = await createAttendance.save();

    res.status(200).json("Attendance Submitted");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

module.exports = router;
