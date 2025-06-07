// src/config/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUpload);
  },
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
    cb(null, nomeUnico);
  },
});

module.exports = multer({ storage });
