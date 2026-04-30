const express = require("express");
const router = express.Router();
const pool = require("../database");
const authMiddleware = require("../middleware/authMiddleware");

// Like/unlike a record
router.post("/like", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { record_id } = req.body;

  // Validation: record_id required
  if (!record_id) {
    return res.status(400).json({ message: "Record id is required" });
  }

  // Security: Ensure record belongs to user
  const [record] = await pool.query(
    "SELECT * FROM energy_records WHERE id = ? AND user_id = ?",
    [record_id, userId]
  );
  if (record.length === 0) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  // Like/unlike logic
  const [existing] = await pool.query(
    "SELECT * FROM likes WHERE user_id = ? AND record_id = ?",
    [userId, record_id]
  );
  if (existing.length > 0) {
    // Unlike
    await pool.query(
      "DELETE FROM likes WHERE user_id = ? AND record_id = ?",
      [userId, record_id]
    );
    return res.json({ liked: false });
  } else {
    // Like
    await pool.query(
      "INSERT INTO likes (user_id, record_id) VALUES (?, ?)",
      [userId, record_id]
    );
    return res.json({ liked: true });
  }
});

// Get likes count and user like status
router.get("/count/:recordId", authMiddleware, async (req, res) => {
  const recordId = req.params.recordId;
  const userId = req.user.id;

  // Count likes
  const [result] = await pool.query(
    "SELECT COUNT(*) AS count FROM likes WHERE record_id = ?",
    [recordId]
  );
  // Check if user liked
  const [userLike] = await pool.query(
    "SELECT 1 FROM likes WHERE user_id = ? AND record_id = ?",
    [userId, recordId]
  );
  res.json({
    count: result[0].count,
    liked: userLike.length > 0
  });
});

module.exports = router;
