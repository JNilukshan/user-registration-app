// Express router for user submission
const express = require('express');
const multer = require('multer');
const path = require('path');
const { createUser } = require('../controllers/userController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// 👇 Use upload.fields for multiple named files
router.post(
  '/register',
  upload.fields([
    { name: 'nicPdf', maxCount: 1 },
    { name: 'licensePdf', maxCount: 1 }
  ]),
  createUser
);
 

module.exports = router;
