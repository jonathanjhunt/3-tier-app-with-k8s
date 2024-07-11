import React, {useState, useEffect} from 'react';
import logo from './logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stopwatch from "./stopwatch";
import TeamList from './teamList';
import PlayerList from './playerList';
import resetVotes from './resetVotes';

function App() {
  // State to trigger re-render
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update state to trigger re-render
      setUpdateKey(prevKey => prevKey + 1);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button style={{ position: 'absolute', top: 0, right: 0, padding: '5px 10px',fontSize: '12px'}}
        class="btn btn-outline-light btn-sm"
        onClick={resetVotes}
        >Reset</button>
      </header>
      <div className="container">
        <div className="row">
          <div className="col d-flex align-items-center justify-content-start">
            <div className="row mx-auto">
            <div class="card" style={{height: '100vh', width: '45vw'}}>
              <div class="card-body">
                <h5 class="card-title">Team of the tournament: Vote Now!</h5>
                <div className="card-body">
                  <TeamList key={updateKey}/>
                </div>
              </div>
            </div>
            </div>
          </div>
          <div className="col d-flex flex-column align-items-center justify-content-end">
            <div className="row mx-auto mb-3">
            <div class="card" style={{width: '35vw', height: '20vh'}}>
              <div class="card-body">
                <h5 class="card-title">In Play</h5>
                <h6 class="card-subtitle mb-2 text-muted" style={{fontSize: '20px'}}><p><Stopwatch/></p></h6>
                <div className="container">
                  <div className="row">
                    <div className="col"><img src="/img/spain.png" alt="Spain" style={{width: '100%', height: 'auto'}}/></div>
                    <div className="col" style={{alignContent: 'center', fontSize: '20px'}}>SPAIN</div>
                    <div className="col" style={{alignContent: 'center', fontSize: '40px'}}>2-0</div>
                    <div className="col" style={{alignContent: 'center', fontSize: '20px'}}>ITALY</div>
                    <div className="col"><img src="/img/italy.png" alt="Italy" style={{width: '100%', height: 'auto'}}/></div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="row mx-auto">
            <div class="card" style={{width: '35vw', height: '80vh'}}>
              <div class="card-body">
              <h5 class="card-title">Player of the tournament: Vote Now!</h5>
                <div className="card-body">
                  <PlayerList key={updateKey}/>
                </div>
                <p class="card-text"></p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;