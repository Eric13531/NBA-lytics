import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FrontPage from "./routes/FrontPage.js";
import PlayerDetails from './routes/PlayerDetails.js';
import PlayerStats from './routes/PlayerStats.js';
import PlayerSeasons from "./routes/PlayerSeasons.js";

import './App.css';

 
/* TODO:
Make Table look better
Add game log selector to top, use same principle as official stats (margin on the right, make numbers smaller)

// Changing stats moves the page slightly right because the scroll bar disappears
// Use the same logic for nba api down as for player stats IN PLAYER GET INFO:
The above exception was the direct cause of the following exception:
Traceback (most recent call last):
  [.....]
requests.exceptions.ReadTimeout: HTTPSConnectionPool(host='stats.nba.com', port=443): Read timed out. (read timeout=30)

// Extra: Change columns to follow same template all the time, regardless of whether the column is there or not

- Make drop list for form to recommend players
- Return table of stats for players
- Create team search page and copy over all logic
- Physical attributes (height/weight/country, positoin, dominant hand, birthday, draft date?, team?) on player profile (nicknames?)
Also have row for all-time stats and career/current year stats?
- yearly stats?

- Link to see accolades
- Find a way to select what stats to appear and disappear

- How to add pictures? Add team logos?
- Stats predictions (analyze trends as well as opposing team stats/player matchups)
- Make feature to see recent tweets/comments about player
- Maybe incorporate highights and videos/clips?
*/

// TODO: Handle wrong year in stats table, change error code
// TODO: Separate regular season and playoff games


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />}/>
        <Route path="/player/:playerId" element={<PlayerDetails/>} />
        <Route path="/player/:playerId/stats/:season" element={<PlayerStats />} />
        <Route path="/player/:playerId/season" element={<PlayerSeasons />} />
      </Routes>
    </Router>
  );
}

export default App;
