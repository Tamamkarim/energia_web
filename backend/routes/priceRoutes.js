const express = require("express");

const router = express.Router();

router.get("/current", async (req, res) => {
  try {
    const response = await fetch("https://sahkotin.fi/prices?fix&vat");
    const data = await response.json();

    const prices = data.prices || [];

    if (prices.length === 0) {
      return res.status(404).json({ message: "No electricity prices found" });
    }

    const latestPrice = prices[prices.length - 1];

    res.json({
      price: latestPrice.value,
      unit: "snt/kWh",
      date: latestPrice.date,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch electricity price",
      error: error.message,
    });
  }
});

module.exports = router;
