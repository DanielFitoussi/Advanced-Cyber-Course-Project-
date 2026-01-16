const mongoose = require('mongoose');

const GlobalChallengeSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true,
    unique: true
  },
  solved: {
    type: Boolean,
    default: false
  },
  solvedAt: {
    type: Date
  }
});

module.exports = mongoose.model(
  'GlobalChallenge',
  GlobalChallengeSchema
);
