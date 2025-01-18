const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  grade: {
  type: String,
  required: true,
  enum: [
    "Grade_1",
    "Grade_2",
    "Grade_3",
    "Grade_4",
    "Grade_5",
    "Grade_6",
    "Grade_7",
    "Grade_8",
    "Grade_9",
    "Grade_10",
    "Grade_11",
    "Grade_12"
  ]
},
  subject: {
    type: String,
    required: true,
    enum: ["Maths", "Myanmar", "Science", "Life_Skills", "Social_Studies", "English", "Geography", "Biology", "Economics", "Art", "History", "Physics"]
  },
  fileType: {type: String, required: true, enum: ["Textbook", "Answer_Book"]},
  curriculumType: {type: String, required: true, enum: ["New", "Old"]},
  courseLength: {type: String, enum: ["Full", "Half"]},  // Default value for courseLength
  part: {type: String, enum: ["1st_part", "2nd_part", "3rd_part", ""]},  // Default value for part (empty string)
  pdfUrl: {type: String, required: true},
  thumbnailUrl: {type: String, required: true},
  uploadedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Books", bookSchema);
