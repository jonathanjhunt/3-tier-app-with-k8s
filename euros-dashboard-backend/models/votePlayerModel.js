const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  player: { // This field stores the team name
    type: String,
    required: true,
    unique: true // Assuming each team name is unique
  },
  team: { // This field stores the team name
    type: String,
    required: true,
    unique: false
  },
  votes: { // This field stores the number of votes for the team
    type: Number,
    required: true,
    default: 0 // Start with 0 votes
  },
  countrycode: { // this field stores the country code for referencing country flags}
    type: String,
    required: true,
    unique: true
  }
});

const PlayerVote = mongoose.model('PlayerVote', voteSchema, 'player-vote');

module.exports = PlayerVote;