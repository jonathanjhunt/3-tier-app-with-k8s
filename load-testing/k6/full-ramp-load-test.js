import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 250 },
        { duration: '30s', target: 500 },
        { duration: '60s', target: 1000 },
        { duration: '120s', target: 3000 },
        { duration: '120s', target: 6000 },
        { duration: '120s', target: 4000 },
        // { duration: '120s', target: 4000 },
        // { duration: '120s', target: 4000 },
        // { duration: '120s', target: 5000 },
      ],
      gracefulRampDown: '30s',
    },
  },
};

function getTeam() {
  const teams = [
    'Albania', 'Austria', 'Belgium', 'Croatia', 'Czechia',
    'Denmark', 'England', 'France', 'Georgia', 'Germany',
    'Hungary', 'Italy', 'Netherlands', 'Poland', 'Portugal',
    'Romania', 'Scotland', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Switzerland', 'Türkiye', 'Ukraine'
  ];
  const randomIndex = Math.floor(Math.random() * teams.length);
  return teams[randomIndex];
}

function getPlayer() {
  const players = [
    'Kylian Mbappe','Rodri','Phil Foden','Jude Bellingham',
    'Florian Wirtz','Harry Kane','Toni Kroos','Antoine Griezmann',
    'Eduardo Camavinga','Declan Rice','Kevin De Bruyne','Bukayo Saka',
    'Jamal Musiala','Virgil van Dijk','Bernardo Silva','Josko Gvardiol',
    'Gianluigi Donnarumma','Ilkay Gundogan','Cristiano Ronaldo','Manuel Neuer'
  ];
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex];
}

function sendVote() {
  const url = 'http://aac430ee9d6d746ae858311e630cf0d2-8382737.eu-west-1.elb.amazonaws.com/api/vote';
  const payload = JSON.stringify({
    team: getTeam(),
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}

function sendPlayerVote() {
  const url = 'http://aac430ee9d6d746ae858311e630cf0d2-8382737.eu-west-1.elb.amazonaws.com/api/playerVote';
  const payload = JSON.stringify({
    player: getPlayer(),
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}
export default function() {
  http.get('http://aac430ee9d6d746ae858311e630cf0d2-8382737.eu-west-1.elb.amazonaws.com/');
  sleep(1);
  http.get('http://aac430ee9d6d746ae858311e630cf0d2-8382737.eu-west-1.elb.amazonaws.com/api/getVotes');
  sleep(1);
  http.get('http://aac430ee9d6d746ae858311e630cf0d2-8382737.eu-west-1.elb.amazonaws.com/api/getPlayerVotes');
  sleep(1);
  sendVote();
  sleep(1);
  sendPlayerVote();
}