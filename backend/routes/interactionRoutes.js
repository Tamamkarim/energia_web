const express = require("express");
const router = express.Router();
const pool = require("../database");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  res.json({ message: "Interactions route works" });
});

// Add comment
router.post("/comments", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { record_id, comment } = req.body;

    if (!record_id || !comment) {
      return res.status(400).json({ message: "Record id and comment are required" });
    }

    await pool.query(
      "INSERT INTO comments (user_id, record_id, comment) VALUES (?, ?, ?)",
      [userId, record_id, comment]
    );

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
});

// Get comments
router.get("/comments/:recordId", authMiddleware, async (req, res) => {
  try {
    const recordId = req.params.recordId;

    const [comments] = await pool.query(
      `SELECT c.id, c.comment, c.created_at, u.name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.record_id = ?
       ORDER BY c.created_at DESC`,
      [recordId]
    );

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get likes count + status
router.get("/likes/:recordId", authMiddleware, async (req, res) => {
  try {
    const recordId = req.params.recordId;
    const userId = req.user.id;

    const [result] = await pool.query(
      "SELECT COUNT(*) AS count FROM likes WHERE record_id = ?",
      [recordId]
    );

    const [userLike] = await pool.query(
      "SELECT 1 FROM likes WHERE user_id = ? AND record_id = ?",
      [userId, recordId]
    );

    res.json({
      count: result[0].count,
      liked: userLike.length > 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Like / Unlike
router.post("/likes", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { record_id } = req.body;

    if (!record_id) {
      return res.status(400).json({ message: "Record id is required" });
    }

    const [existing] = await pool.query(
      "SELECT * FROM likes WHERE user_id = ? AND record_id = ?",
      [userId, record_id]
    );

    if (existing.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE user_id = ? AND record_id = ?",
        [userId, record_id]
      );

      return res.json({ liked: false });
    }

    await pool.query(
      "INSERT INTO likes (user_id, record_id) VALUES (?, ?)",
      [userId, record_id]
    );

    res.json({ liked: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;