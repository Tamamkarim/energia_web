const express = require("express");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/authMiddleware");

const {
	uploadFile,
	getUserFiles,
} = require("../controllers/fileController");

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},

	filename: (req, file, cb) => {
		const uniqueName =
			Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

		cb(null, uniqueName);
	},
});

const upload = multer({ storage });

router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/", verifyToken, getUserFiles);

module.exports = router;
