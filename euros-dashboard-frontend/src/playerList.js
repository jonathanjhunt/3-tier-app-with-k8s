import React, { useEffect, useState } from 'react';
import getPlayerVotes from "./getPlayerVotes";
import sendPlayerVote from './sendPlayerVote';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const PlayerList = () => {
  const [sortedPlayers, setSortedPlayers] = useState({});
  const [votedFor, setVotedFor] = useState(false); // State to track voted player

  useEffect(() => {
    getPlayerVotes().then(player => {
      const sortedArray = Object.entries(player).sort((a, b) => b[1].votes - a[1].votes);
      const sortedObject = Object.fromEntries(sortedArray);
      setSortedPlayers(sortedObject);
    }).catch(error => {
      console.error("Failed to fetch players:", error);
    });
  }, []);

  const handleVote = (player) => {
    sendPlayerVote({ player });
    setVotedFor(true); // Set to true when any vote is cast
  };
  
    return (
        <div style={{ height: '60vh', overflowY: 'auto' }}>
        {Object.entries(sortedPlayers).map(([player, {team, votes, countrycode}]) => (
            <div key={player} className="container" style={{ height: '8vh' }}>
            <div className="row">
                <div className="col" style={{ alignContent: 'left'}}>
                <img
                    src={`https://flagcdn.com/w40/${countrycode}.png`}
                    srcSet={`https://flagcdn.com/w80/${countrycode}.png 2x`}
                    width="40"
                    height="40"
                    alt={`${team} flag`}
                    class="rounded-circle shadow-4-strong"></img>
                </div>
                <div className="col" style={{ alignContent: 'center', fontSize: '20px' }}>
                {player}
                </div>
                <div className="col" style={{ alignContent: 'right', fontSize: '20px' }}>
                {votes}
                </div>
                <div className="col" style={{ alignContent: 'right' }}>
                <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => handleVote(player)}
                disabled={votedFor} //Disable the button if voted
              >
                  Vote
              </button>
                </div>
            </div>
            </div>
        ))}
        </div>
    )};
export default PlayerList;
