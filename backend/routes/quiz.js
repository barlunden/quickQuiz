

// Express router for quiz-related endpoints
const express = require('express');
const router = express.Router();
// Dynamic import for node-fetch (used to fetch quiz questions from Open Trivia API)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// Prisma client for database access
const prisma = require('../db');
// Middleware to verify JWT token
const verifyToken = require('../middleware/verifyToken');


// GET /quiz
// Fetches quiz questions from the Open Trivia API based on query params
// Params: amount, category, difficulty, type
router.get('/', async (req, res) => {
	const { amount = 10, category, difficulty, type } = req.query;
	const params = new URLSearchParams();
	params.append('amount', amount);
	if (category) params.append('category', category);
	if (difficulty) params.append('difficulty', difficulty);
	if (type) params.append('type', type);

	const url = `https://opentdb.com/api.php?${params.toString()}`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch questions.' });
	}
});


// GET /quiz/scoreboard
// Returns a leaderboard with total points, accuracy, and best category for each user
router.get('/scoreboard', async (req, res) => {
	try {
		// Get all users and their quiz results
		const users = await prisma.user.findMany({
			include: {
				quizResults: true,
			},
		});

		// Calculate stats for each user
		const scoreboard = users.map((user) => {
			const totalScore = user.quizResults.reduce((sum, r) => sum + r.score, 0);
			const totalQuestions = user.quizResults.reduce((sum, r) => sum + r.total, 0);
			const percent = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
			// Find best category (highest percent correct, then most correct answers)
			let bestCategory = null;
			if (user.quizResults.length > 0) {
				const catStats = {};
				for (const r of user.quizResults) {
					if (!r.category) continue;
					if (!catStats[r.category]) catStats[r.category] = { score: 0, total: 0 };
					catStats[r.category].score += r.score;
					catStats[r.category].total += r.total;
				}
				let best = null;
				for (const [cat, s] of Object.entries(catStats)) {
					const pct = s.total > 0 ? s.score / s.total : 0;
					if (!best || pct > best.pct || (pct === best.pct && s.score > best.score)) {
						best = { cat, pct, score: s.score };
					}
				}
				if (best) bestCategory = { category: best.cat, percent: Math.round(best.pct * 100) };
			}
			return {
				nickname: user.nickname,
				totalScore,
				totalQuestions,
				percent,
				bestCategory,
			};
		});

		res.json(scoreboard);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch scoreboard.' });
	}
});

module.exports = router;


// POST /quiz/result
// Save a quiz result for the logged-in user (requires JWT)
// Body: { score, total, category, difficulty }
router.post('/result', verifyToken, async (req, res) => {
	const { score, total, category, difficulty } = req.body;
	const userId = req.userId;
	if (typeof score !== 'number' || typeof total !== 'number') {
		return res.status(400).json({ error: 'Score and total must be numbers.' });
	}
	try {
		const result = await prisma.quizResult.create({
			data: {
				userId,
				score,
				total,
				category,
				difficulty,
			},
		});
		res.status(201).json(result);
	} catch (err) {
		res.status(500).json({ error: 'Failed to save quiz result.' });
	}
});


// GET /quiz/stats
// Returns stats for the logged-in user (requires JWT)
// Includes: nickname, total score, total questions, percent correct, best category
router.get('/stats', verifyToken, async (req, res) => {
	const userId = req.userId;
	try {
		const results = await prisma.quizResult.findMany({
			where: { userId },
		});
		const totalScore = results.reduce((sum, r) => sum + r.score, 0);
		const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
		const percent = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
		// Find best category (highest percent correct, then most correct answers)
		let bestCategory = null;
		if (results.length > 0) {
			const catStats = {};
			for (const r of results) {
				if (!r.category) continue;
				if (!catStats[r.category]) catStats[r.category] = { score: 0, total: 0 };
				catStats[r.category].score += r.score;
				catStats[r.category].total += r.total;
			}
			   // Finn beste
			   let best = null;
			   for (const [cat, s] of Object.entries(catStats)) {
				   const pct = s.total > 0 ? s.score / s.total : 0;
				   if (!best || pct > best.pct || (pct === best.pct && s.score > best.score)) {
					   best = { cat, pct, score: s.score };
				   }
			   }
			   if (best) bestCategory = { category: best.cat, percent: Math.round(best.pct * 100) };
		   }
		   // Get nickname
		   const user = await prisma.user.findUnique({ where: { id: userId }, select: { nickname: true } });
		   res.json({
			   nickname: user?.nickname,
			   totalScore,
			   totalQuestions,
			   percent,
			   bestCategory,
		   });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch stats.' });
	}
});
