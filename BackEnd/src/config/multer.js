// src/config/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cria a pasta caso não exista
const pastaUpload = path.resolve(__dirname, "../uploads/produtos");
if (!fs.existsSync(pastaUpload)) {
  fs.mkdirSync(pastaUpload, { recursive: true });
}

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
