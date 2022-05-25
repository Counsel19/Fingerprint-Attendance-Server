const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
 
  user_docId: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  semester:{
      type: String,
      required: true,
  },
  session:{
      type: String,
      required: true,
  },
  date: {
    type: Number,
    required: true,
  },
 students_present:[String]
});

const Attendance = new mongoose.model("ATTENDANCE", attendanceSchema);

module.exports = Attendance;
