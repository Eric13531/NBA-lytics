import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FrontPage from "./routes/FrontPage.js";
import PlayerDetails from './routes/PlayerDetails.js';
import PlayerStats from './routes/PlayerStats.js';
import PlayerSeasons from "./routes/PlayerSeasons.js";
import PlayerAwards from "./routes/PlayerAwards.js";
import TeamDetails from "./routes/TeamDetails.js";
import TeamStats from "./routes/TeamStats.js";
import TeamSeasons from "./routes/TeamSeasons.js";
import PlayerFrontPage from "./routes/PlayerFrontPage.js";
import TeamFrontPage from "./routes/TeamFrontPage.js";

import './App.css';

 
/* TODO:
// Changing stats moves the page slightly right because the scroll bar disappears
// Use the same logic for nba api down as for player stats IN PLAYER GET INFO:
The above exception was the direct cause of the following exception:
Traceback (most recent call last):
  [.....]
requests.exceptions.ReadTimeout: HTTPSConnectionPool(host='stats.nba.com', port=443): Read timed out. (read timeout=30)

// Extra: Change columns to follow same template all the time, regardless of whether the column is there or not
// FOr search, add autocomplete (the first value in suggestions)
// Add more support for search suggestions (state, city, nickname, abbreviation)
// get_player_id is incorrect: What if name is prefix of different name?
// ONLY ACCEPT IF NAME IS EXACTLY THE SAME OR ONLY ONE RESULT

Also have row for all-time stats and career/current year stats? (mostly done)

- Link to see accolades
- Find a way to select what stats to appear and disappear

- Stats predictions (analyze trends as well as opposing team stats/player matchups)
- Make feature to see recent tweets/comments about player
- Maybe incorporate highights and videos/clips?
*/

// Make combined search field?

// TODO: Handle wrong year in stats table, change error code (likely Done)
// TODO: Separate regular season and playoff games
// TODO: Combine regular season and playoff stats into general stats for seasonal averages

// Tweaks:
// Find btter way to make accolades + season averages look better. Maybe squeeze the main block/set max size?
// Add footer
// Add general search field, improve header


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayerFrontPage />}/>
        {/* <Route path="/player" element={<PlayerFrontPage />}/> */}
        <Route path="/team" element={<TeamFrontPage />}/>
        <Route path="/player/:playerId" element={<PlayerDetails/>} />
        <Route path="/player/:playerId/stats/:season" element={<PlayerStats />} />
        <Route path="/player/:playerId/season" element={<PlayerSeasons />} />
        <Route path="/player/:playerId/award" element={<PlayerAwards />} />
        <Route path="/team/:teamId" element={<TeamDetails/>} />
        <Route path="/team/:teamId/stats/:season" element={<TeamStats />} />
        <Route path="/team/:teamId/season" element={<TeamSeasons />} />
      </Routes>
    </Router>
  );
}

export default App;


/*
Completed:

Make Table look better
Add game log selector to top, use same principle as official stats (margin on the right, make numbers smaller)

// FIX SUBTITLE LOADING FIRST IN CAREER
// FIX HEADERS FOR TEAMS AND CAREER (EG YEAR MISSING)

- Make drop list for form to recommend players
- Return table of stats for players
- Create team search page and copy over all logic
- Physical attributes (height/weight/country, positoin, dominant hand, birthday, draft date?, team?) on player profile (nicknames?)
- yearly stats?

- How to add pictures? Add team logos?

*/
