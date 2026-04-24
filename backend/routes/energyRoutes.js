const express = require("express");
const {
  addEnergyRecord,
  getEnergyRecords,
  deleteEnergyRecord,
  updateEnergyRecord,
} = require("../controllers/energyController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, addEnergyRecord);
router.get("/", verifyToken, getEnergyRecords);


router.put("/:id", verifyToken, updateEnergyRecord);
router.delete("/:id", verifyToken, deleteEnergyRecord);

module.exports = router;