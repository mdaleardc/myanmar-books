const express = require("express");
const {home, fileUpload, booksList} = require("../controllers/book.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const bookRoute = express.Router();


bookRoute.get("/", home);

// ensure if uploads folder exist for upload files
if (!fs.existsSync('./App/uploads')) {
  fs.mkdirSync('./App/uploads');
}


// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './App/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  // For PDF files
  if (file.fieldname === "pdfFile") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  }
  // For thumbnail images
  else if (file.fieldname === "thumbnail") {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (PNG, JPG, JPEG) are allowed"), false);
    }
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

bookRoute.post("/upload", upload.fields([{name:"pdfFile", maxCount:1}, {name:"thumbnail", maxCount:1}]), fileUpload)

bookRoute.get("/booklist", booksList);


module.exports = bookRoute;

