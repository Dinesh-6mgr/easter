const Score = require('../models/Score');
const Church = require('../models/Church');
const { validationResult } = require('express-validator');

// POST /api/scores
const saveScore = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, church, score } = req.body;
    const churchName = church.trim();

    // Save score
    const newScore = await Score.create({ name: name.trim(), church: churchName, score });

    // Persist church name for future suggestions (ignore duplicate errors)
    await Church.findOneAndUpdate(
      { name: churchName },
      { name: churchName },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, data: newScore, message: 'Score saved successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /api/scores
const getTopScores = async (req, res, next) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1, createdAt: -1 })
      .limit(20)
      .select('name church score createdAt');

    res.status(200).json({ success: true, count: scores.length, data: scores });
  } catch (error) {
    next(error);
  }
};

// GET /api/scores/rank/:score
const getUserRank = async (req, res, next) => {
  try {
    const higherScores = await Score.countDocuments({ score: { $gt: parseInt(req.params.score) } });
    res.status(200).json({ success: true, rank: higherScores + 1 });
  } catch (error) {
    next(error);
  }
};

// GET /api/scores/check-top/:score
const checkTopRank = async (req, res, next) => {
  try {
    const userScore = parseInt(req.params.score);
    const totalCount = await Score.countDocuments();
    const higherCount = await Score.countDocuments({ score: { $gt: userScore } });
    const rank = higherCount + 1;
    const qualifies = rank <= 20 || totalCount < 20;
    res.status(200).json({ success: true, rank, qualifies });
  } catch (error) {
    next(error);
  }
};

// GET /api/churches — all stored church names
const getChurches = async (req, res, next) => {
  try {
    const churches = await Church.find().sort({ name: 1 }).select('name -_id');
    res.status(200).json({ success: true, data: churches.map((c) => c.name) });
  } catch (error) {
    next(error);
  }
};

// POST /api/churches — manually add a church name
const addChurch = async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    if (!name || name.length < 2) {
      return res.status(400).json({ success: false, message: 'Church name must be at least 2 characters' });
    }
    const church = await Church.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, data: church.name });
  } catch (error) {
    next(error);
  }
};

module.exports = { saveScore, getTopScores, getUserRank, getChurches, addChurch, checkTopRank };
