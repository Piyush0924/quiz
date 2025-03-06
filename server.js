const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();


app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/api/data", (req, res) => {
  res.json({ message: "API is working!" });
});


app.use((req, res) => {
  res.status(404).json({ error: "404: NOT_FOUND" });
});

// Connect to Database First, then Start Server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
