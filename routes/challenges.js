const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/auth')
const User = require('../models/user')
const challenges = require('../config/challenges')
const GlobalChallenge = require('../models/GlobalChallenge');


router.get('/', (req, res) => {
  res.json(challenges)
})

router.get('/private', (req, res) => {
  res.json({
    status: 'ok',
    scope: 'internal',
    endpoints: {
      next: '/api/challenges/private-data'
    }
  });
})

router.get('/private-data', async (req, res) => {
  try {
    await GlobalChallenge.updateOne(
      { challengeId: 'api_auth_1' },
      {
        $set: {
          solved: true,
          solvedAt: new Date()
        }
      },
      { upsert: true }
    );

    res.json({
      data: 'secret',
      challengeSolved: 'api_auth_1',
      solvedBy: 'unauthenticated-direct-access'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});




router.post('/solve', authenticateToken, async (req, res) => {
  try {
    const { challengeId } = req.body;

    if (!challengeId) {
      return res.status(400).json({ error: 'challengeId is required' });
    }

    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!Array.isArray(user.solvedChallenges)) {
      user.solvedChallenges = [];
    }

    if (!user.solvedChallenges.includes(challengeId)) {
      user.solvedChallenges.push(challengeId);
      await user.save();
    }

    return res.json({ success: true, challengeId });
  } catch (err) {
    console.error('❌ Error in /api/challenges/solve:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/global-status', async (req, res) => {
  try {
    const solvedChallenges = await GlobalChallenge.find(
      { solved: true },
      { _id: 0, challengeId: 1 }
    );

    res.json({
      solved: solvedChallenges.map(c => c.challengeId)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router
