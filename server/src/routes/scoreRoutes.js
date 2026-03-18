const express = require('express');
const { body } = require('express-validator');
const {
  saveScore,
  getTopScores,
  getUserRank,
  getChurches,
  addChurch,
  checkTopRank
} = require('../controllers/scoreController');

const router = express.Router();

const validateScore = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('church').trim().notEmpty().withMessage('Church name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Church must be between 2 and 100 characters'),
  body('score').isInt({ min: 0 }).withMessage('Score must be a positive integer')
    .custom((value) => {
      if (value < 30) throw new Error('Score must be at least 30 to submit');
      return true;
    })
];

// ── Static routes FIRST (before any :param routes) ───────────────────────────
router.get('/churches', getChurches);
router.post('/churches', addChurch);

// ── Scores ────────────────────────────────────────────────────────────────────
router.route('/').get(getTopScores).post(validateScore, saveScore);

// ── Param routes LAST ─────────────────────────────────────────────────────────
router.get('/check-top/:score', checkTopRank);
router.get('/rank/:score', getUserRank);

module.exports = router;
