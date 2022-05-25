const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        require: true,
    },
    course_title: {
        type: String,
        require: true,
    },
    num_students_offering:{
        type: Number,
        required: true,
    },
    course_lecturers: [String]
})


const Courses = new mongoose.model("COURSES", courseSchema);

module.exports = Courses