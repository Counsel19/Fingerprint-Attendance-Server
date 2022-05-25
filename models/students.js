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
  fingerprint: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
});

const Students = new mongoose.model("STUDENTS", studentSchema);

module.exports = Students;
