import React, { useEffect, useState } from 'react';
import getVotes from "./getVotes";
import sendVote from './sendVote';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const TeamList = () => {
  const [sortedTeams, setSortedTeams] = useState({});
  const [votedFor, setVotedFor] = useState(false); // Step 1: State to track voted teams

  useEffect(() => {
    getVotes().then(teams => {
      const sortedArray = Object.entries(teams).sort((a, b) => b[1].votes - a[1].votes);
      const sortedObject = Object.fromEntries(sortedArray);
      setSortedTeams(sortedObject);
    }).catch(error => {
      console.error("Failed to fetch teams:", error);
    });
  }, []);

  const handleVote = (team) => {
    sendVote({ team });
    setVotedFor(true); // Set to true when any vote is cast
  };
  
    return (
        <div style={{ height: '85vh', overflowY: 'auto' }}>
        {Object.entries(sortedTeams).map(([team, {votes, countrycode}]) => (
            <div key={team} className="container" style={{ height: '8vh' }}>
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
                {team}
                </div>
                <div className="col" style={{ alignContent: 'center', fontSize: '20px' }}>
                {votes}
                </div>
                <div className="col" style={{ alignContent: 'right' }}>
                <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => handleVote(team)}
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
export default TeamList;
