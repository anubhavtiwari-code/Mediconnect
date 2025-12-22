import multer from "multer";

// Allowed file types
const allowed = ["image/jpeg", "image/png", "application/pdf"];

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter
function fileFilter(req, file, cb) {
  if (allowed.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Invalid file format! Only JPG, PNG, and PDF allowed."), false);
  }
}

// Export multer instance
export const upload = multer({ storage, fileFilter });
