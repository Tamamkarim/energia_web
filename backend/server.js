const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const energyRoutes = require("./routes/energyRoutes");
const priceRoutes = require("./routes/priceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/energy", energyRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Eco Energy Tracker API is running");
});

const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
