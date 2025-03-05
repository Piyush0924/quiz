const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");

//  Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    // Validate request body
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Title and at least one question are required" });
    }

    // Create and save the quiz
    const quiz = new Quiz({ title, questions });
    await quiz.save();

    res.status(201).json({ success: true, message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error: error.message });
  }
};

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Fetch all quizzes from the database

    if (!quizzes.length) {
      return res.status(404).json({ message: "No quizzes available" });
    }

    res.status(200).json({ success: true, message: "Quizzes list retrieved", quizzes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error: error.message });
  }
};

//  Take a quiz and calculate score
exports.takeQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Validate quizId
    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    // Fetch the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Validate answers array
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: "Answers array must match the number of questions" });
    }

    let score = 0;
    let correctAnswers = [];
    let userResponses = [];

    // Check each answer
    quiz.questions.forEach((question, index) => {
      const userAnswer = (answers[index] || "").trim();
      const correctAnswer = question.correctAnswer.trim();

      if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        score++; // Increase score if correct
      }

      correctAnswers.push(correctAnswer);
      userResponses.push(userAnswer);
    });

    // Calculate percentage
    const percentageScore = ((score / quiz.questions.length) * 100).toFixed(2);

    // Send response
    res.status(200).json({
      success: true,
      score,
      totalQuestions: quiz.questions.length,
      percentage: `${percentageScore}%`,
      correctAnswers,
      userResponses,
    });

  } catch (error) {
    res.status(500).json({ message: "Error processing quiz", error: error.message });
  }
};
