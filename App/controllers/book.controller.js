const bookModel = require("../models/book.model");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Render Home Page
const home = (req, res) => {
  res.render("index");
};

// Upload Files (PDF and Thumbnail)
const fileUpload = async (req, res) => {
  try {
    // Debug MIME types to ensure correct file handling
    console.log("PDF MIME Type:", req.files['pdfFile'][0].mimetype);
    console.log("Thumbnail MIME Type:", req.files['thumbnail'][0].mimetype);

    // Upload PDF to 'pdfs' folder with resource_type 'raw'
    const pdfUpload = await cloudinary.uploader.upload(req.files['pdfFile'][0].path, {
      resource_type: "raw",       // Force Cloudinary to treat it as a file, not an image
      folder: "pdfs",             // Store in 'pdfs' folder
      use_filename: true,         // Keep the original filename
      unique_filename: false,     // Avoid random characters in filename
      overwrite: true             // Allow overwriting files
    });
    console.log("PDF Uploaded:", pdfUpload);

    // Upload Thumbnail to 'thumbnails' folder with resource_type 'image'
    const thumbnailUpload = await cloudinary.uploader.upload(req.files['thumbnail'][0].path, {
      resource_type: "image",     // Explicitly treat as an image
      folder: "thumbnails",       // Store in 'thumbnails' folder
      use_filename: true,         // Keep the original filename
      unique_filename: false,     // Avoid random characters in filename
      overwrite: true             // Allow overwriting files
    });
    console.log("Thumbnail Uploaded:", thumbnailUpload);

    // Extract form data
    const { grade, subject, fileType, curriculumType, courseLength = "Full", part = "" } = req.body;

// Save file information to MongoDB
const book = await bookModel.create({
  title: `${grade} ${subject} ${fileType} ${curriculumType}`,
  grade,
  subject,
  fileType,
  curriculumType,
  courseLength,  // Include courseLength from req.body, defaulting to "Full"
  part,  // Include part from req.body, defaulting to ""
  pdfUrl: pdfUpload.secure_url,
  thumbnailUrl: thumbnailUpload.secure_url,
});

// Delete local files after successful upload
    fs.unlinkSync(req.files['pdfFile'][0].path);
    console.log('Local PDF file deleted');

    fs.unlinkSync(req.files['thumbnail'][0].path);
    console.log('Local thumbnail image deleted');

    console.log("File uploaded and saved successfully.");
    res.redirect(process.env.API_URL);
  } catch (err) {
    console.error("Error uploading files:", err.message);
    res.status(500).json("Failed to upload files!");
  }
};


const booksList = async (req, res) => {
  try {
  const list = await bookModel.find();
  res.render("bookList", {list});
  } catch (err) {
    res.status(500).json(err.message);
  }
}

module.exports = { home, fileUpload, booksList };