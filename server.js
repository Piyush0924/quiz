const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

/*-------- Global Middlewares -------- */
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

/*--------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

/*------ Connect to Database First ,then server-----*/
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
