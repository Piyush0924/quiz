const express = require("express");
const { createQuiz, getQuizzes, takeQuiz } = require("../controllers/quizControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createQuiz);
router.get("/", getQuizzes); // Quiz is publicly accessible
router.post("/take", authMiddleware, takeQuiz);

module.exports = router;
