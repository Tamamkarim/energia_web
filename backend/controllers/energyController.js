// Energy controller logic will go here
const pool = require("../database");

const addEnergyRecord = async (req, res) => {
  try {
    const { consumption, date, notes } = req.body;
    const userId = req.user.id;

    if (!consumption || !date) {
      return res.status(400).json({ message: "Consumption and date are required" });
    }

    await pool.query(
      "INSERT INTO energy_records (user_id, consumption, date, notes) VALUES (?, ?, ?, ?)",
      [userId, consumption, date, notes || null]
    );

    res.status(201).json({ message: "Energy record added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add energy record", error: error.message });
  }
};

const getEnergyRecords = async (req, res) => {
  try {
    const userId = req.user.id;

    const [records] = await pool.query(
      "SELECT * FROM energy_records WHERE user_id = ? ORDER BY date DESC",
      [userId]
    );

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to get energy records", error: error.message });
  }
};

const deleteEnergyRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const recordId = req.params.id;

    const [result] = await pool.query(
      "DELETE FROM energy_records WHERE id = ? AND user_id = ?",
      [recordId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Energy record not found" });
    }

    res.json({ message: "Energy record deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete energy record",
      error: error.message,
    });
  }

};

const updateEnergyRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const recordId = req.params.id;
    const { consumption, date, notes } = req.body;

    if (!consumption || !date) {
      return res.status(400).json({ message: "Consumption and date are required" });
    }

    const [result] = await pool.query(
      "UPDATE energy_records SET consumption = ?, date = ?, notes = ? WHERE id = ? AND user_id = ?",
      [consumption, date, notes || null, recordId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Energy record not found" });
    }

    res.json({ message: "Energy record updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update energy record",
      error: error.message,
    });
  }
};

module.exports = {
  addEnergyRecord,
  getEnergyRecords,
  deleteEnergyRecord,
  updateEnergyRecord,
};