const express = require('express')
const router = express.Router()

const challenges = require('../config/challenges')

router.get('/', (req, res) => {
    res.json(challenges)
})

module.exports = router
