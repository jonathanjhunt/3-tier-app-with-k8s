require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Vote = require('./models/voteModel');
const PlayerVote = require('./models/votePlayerModel'); 

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: '*', // Allow all origins for testing purposes
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
app.use(express.json());

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUri = `mongodb://${mongoUsername}:${mongoPassword}@database:27017/euros-vote-db?authSource=admin`;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

  app.post('/api/vote', async (req, res) => {
    const { team } = req.body; // Assuming 'team' is the key that contains the team name
    try {
      // Find the document with the matching team name and increment its votes
      const updatedVote = await Vote.findOneAndUpdate(
        { team: team }, // Use the 'team' field to find the correct document
        { $inc: { votes: 1 } }, // Increment the 'votes' field by 1
      );
      res.status(200).send(updatedVote);
    } catch (error) {
      console.error('Error updating vote:', error);
      res.status(500).send('Error processing your vote');
    }
  });

  app.post('/api/playerVote', async (req, res) => {
    const { player } = req.body; // Assuming 'team' is the key that contains the team name
    try {
      // Find the document with the matching team name and increment its votes
      const updatedVote = await PlayerVote.findOneAndUpdate(
        { player: player }, // Use the 'team' field to find the correct document
        { $inc: { votes: 1 } }, // Increment the 'votes' field by 1
      );
      res.status(200).send(updatedVote);
    } catch (error) {
      console.error('Error updating vote:', error);
      res.status(500).send('Error processing your vote');
    }
  });
  // Add a GET endpoint to fetch votes for all teams
  app.get('/api/getVotes', async (req, res) => {
    try {
      const allData = await Vote.find({});
      const dataDictionary = {};
      allData.forEach(data => {
        dataDictionary[data.team] = { votes: data.votes, countrycode: data.countrycode };
      });
      res.status(200).json(dataDictionary);
    } catch (error) {
      console.error('Error fetching votes:', error);
      res.status(500).send('Error fetching data');
    }
  });

    // Add a GET endpoint to fetch votes for all players
    app.get('/api/getPlayerVotes', async (req, res) => {
      try {
        const allPlayerData = await PlayerVote.find({});
        const playerDataDictionary = {};
        allPlayerData.forEach(playerData => {
          playerDataDictionary[playerData.player] = { team: playerData.team, votes: playerData.votes, countrycode: playerData.countrycode };
        });
        res.status(200).json(playerDataDictionary);
      } catch (error) {
        console.error('Error fetching player votes:', error);
        res.status(500).send('Error fetching data');
      }
    });
    // Add a POST endpoint to reset all votes to 0
    app.post('/api/resetVotes', async (req, res) => {
      try {
        // Reset all team votes to 0
        await Vote.updateMany({}, { $set: { votes: 0 } });
        // Reset all player votes to 0
        await PlayerVote.updateMany({}, { $set: { votes: 0 } });
    
        res.status(200).send('All votes have been reset to 0');
      } catch (error) {
        console.error('Error resetting votes:', error);
        res.status(500).send('Error resetting votes');
      }
    });
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});