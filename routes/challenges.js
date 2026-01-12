const express = require('express')
const router = express.Router()

const challenges = require('../config/challenges')

router.get('/', (req, res) => {
    res.json(challenges)
})

router.get('/private-data', (req, res) => {
  res.cookie('api_visited', 'true');
  res.json({ msg: 'ok', data: 'secret' });
});


module.exports = router
