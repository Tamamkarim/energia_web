const express = require("express");
const pool = require("../database");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/users", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/records", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const [records] = await pool.query(`
      SELECT energy_records.*, users.name, users.email
      FROM energy_records
      JOIN users ON energy_records.user_id = users.id
      ORDER BY energy_records.created_at DESC
    `);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records" });
  }
});

module.exports = router;
