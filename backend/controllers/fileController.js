const pool = require("../database");

const uploadFile = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		await pool.query(
			`INSERT INTO files 
			(user_id, filename, original_name, file_path, mimetype) 
			VALUES (?, ?, ?, ?, ?)`,
			[
				userId,
				req.file.filename,
				req.file.originalname,
				req.file.path,
				req.file.mimetype,
			]
		);

		res.status(201).json({
			message: "File uploaded successfully",
			file: req.file,
		});
	} catch (error) {
		res.status(500).json({
			message: "File upload failed",
			error: error.message,
		});
	}
};

const getUserFiles = async (req, res) => {
	try {
		const userId = req.user.id;

		const [files] = await pool.query(
			"SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC",
			[userId]
		);

		res.json(files);
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch files",
			error: error.message,
		});
	}
};

module.exports = {
	uploadFile,
	getUserFiles,
};
