const express = require("express");
const router = express.Router();
const pool = require("../database");
const authMiddleware = require("../middleware/authMiddleware");

// =======================
// Get comments (dummy)
// =======================
router.get("/comments/:recordId", authMiddleware, async (req, res) => {
  res.json([]);
});

// =======================
// Get likes count + status
// =======================
router.get("/likes/:recordId", authMiddleware, async (req, res) => {
  const recordId = req.params.recordId;
  const userId = req.user.id;

  try {
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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// Like / Unlike
// =======================
router.post("/likes", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { record_id } = req.body;

  if (!record_id) {
    return res.status(400).json({ message: "Record id is required" });
  }

  try {
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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;