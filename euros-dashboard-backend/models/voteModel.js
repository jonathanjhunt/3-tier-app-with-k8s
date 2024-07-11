const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  team: { // This field stores the team name
    type: String,
    required: true,
    unique: true // Assuming each team name is unique
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

const Vote = mongoose.model('Vote', voteSchema, 'team-vote');

module.exports = Vote;