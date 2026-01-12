const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/auth')
const User = require('../models/user')
const challenges = require('../config/challenges')

router.get('/', (req, res) => {
  res.json(challenges)
})

router.get('/private-data', authenticateToken, async (req, res) => {
  const userId = req.user.userId
  let challengeSolved = null

  const user = await User.findById(userId)

  if (user && !user.solvedChallenges.includes('api_auth_1')) {
    user.solvedChallenges.push('api_auth_1')
    await user.save()
    challengeSolved = 'api_auth_1'
  }

  res.json({
    data: 'secret',
    challengeSolved
  })
})

module.exports = router
