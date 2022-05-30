const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  reg_number: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  },
  fingerprint: {
    type: Array,
    required: true,
  },
  cloudinary_id: {
    type: String,
  },
});

const Students = new mongoose.model("STUDENTS", studentSchema);

module.exports = Students;
