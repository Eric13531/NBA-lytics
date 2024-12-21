import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "./FrontPage.module.css";
import axios from "axios";

const deploymentStatus = process.env.REACT_APP_DEPLOYMENTSTATUS;
// console.log("deployment status", deploymentStatus)

const PlayerSearchForm = () => {
    const [playerName, setPlayerName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchCompleted, setSearchCompleted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getSearchResults = async () => {
            if (playerName.length < 3) {
                setSearchResults([]);
            } else {
                try {
                    let response = null
                    if (deploymentStatus === "production") {
                        response = await axios.get(
                            // "http://localhost:8000/api/players/get_player_search_results/",
                            "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_search_results/",
                            {
                                params: { player_name: playerName },
                            }
                        );
                    } else if (deploymentStatus === "development") {
                        response = await axios.get(
                            "http://localhost:8000/api/players/get_player_search_results/",
                            // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_search_results/",
                            {
                                params: { player_name: playerName },
                            }
                        );
                    }
                    // const response = await axios.get(
                    //     "http://localhost:8000/api/players/get_player_search_results/",
                    //     // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_search_results/",
                    //     {
                    //         params: { player_name: playerName },
                    //     }
                    // );
                    const playerNames = response.data.player_info.map(
                        (obj) => obj.full_name
                    );
                    setSearchResults(playerNames);
                    console.log(playerNames);
                } catch (error) {
                    console.error("Error fetching names:", error);
                }
            }
        };

        if (playerName && !searchCompleted) {
            getSearchResults();
        } else {
            setSearchResults([]);
            setSearchCompleted(false);
        }
    }, [playerName]);

    const handleSuggestionClick = (suggestion, event) => {
        setPlayerName(suggestion);
        setSearchResults([]);
        console.log(searchResults)
        event.stopPropagation();
        setSearchCompleted(true);
    };

    const handleInputChange = (event) => {
        setPlayerName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // const response = await axios.get("player nba api link");
            // const response = {'data': {'id': 100}}
            let response = null
            if (deploymentStatus === "production") {
                response = await axios.get(
                    // "http://localhost:8000/api/players/get_player_id/",
                    "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_id/",
                    {
                        params: { player_name: playerName },
                    }
                );
            } else if (deploymentStatus === "development") {
                response = await axios.get(
                    "http://localhost:8000/api/players/get_player_id/",
                    // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_id/",
                    {
                        params: { player_name: playerName },
                    }
                );
            }
            // const response = await axios.get(
            //     "http://localhost:8000/api/players/get_player_id/",
            //     // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_id/",
            //     {
            //         params: { player_name: playerName },
            //     }
            // );
            console.log(response);
            console.log(response.data);
            const playerId = response.data.player_id;

            navigate(`/player/${playerId}`);
        } catch (error) {
            console.error("Error fetching player ID:", error);
            // Handle error, display error message, etc.
        }
    };

    return (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
            <label className={styles.searchLabel}>
                {"Search by Player Name: "}
            </label>
            <div className={styles.searchContent}>
                <input
                    type="text"
                    value={playerName}
                    onChange={handleInputChange}
                    placeholder="Enter Player Name"
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchSubmit}>
                    <img
                        className={styles.searchImage}
                        src="/1200px-Magnifying_glass_icon.svg.png"
                        alt=""
                    />
                </button>
            </div>
            {searchResults.length > 0 && (
                <ul className={styles.searchResults}>
                    {searchResults.slice(0, 6).map((name, index) => (
                        <li
                            className={styles.searchResult}
                            key={index}
                            onClick={(event) =>
                                handleSuggestionClick(name, event)
                            }
                        >
                            {name}
                        </li>
                    ))}
                    {searchResults.length > 6 && <div className={styles.searchExtra}>...</div>}
                </ul>
            )}
        </form>
    );
};

const TeamSearchForm = () => {
    const [teamName, setTeamName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchCompleted, setSearchCompleted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getSearchResults = async () => {
            if (teamName.length < 1) {
                setSearchResults([]);
            } else {
                try {
                    let response = null
                    if (deploymentStatus === "production") {
                        response = await axios.get(
                            // "http://localhost:8000/api/players/get_team_search_results/",
                            "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_search_results/",
                            {
                                params: { team_name: teamName },
                            }
                        );
                    } else if (deploymentStatus === "development") {
                        response = await axios.get(
                            "http://localhost:8000/api/players/get_team_search_results/",
                            // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_search_results/",
                            {
                                params: { team_name: teamName },
                            }
                        );
                    }
                    // const response = await axios.get(
                    //     "http://localhost:8000/api/players/get_team_search_results/",
                    //     // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_search_results/",
                    //     {
                    //         params: { team_name: teamName },
                    //     }
                    // );
                    const teamNames = response.data.team_info.map(
                        (obj) => obj.full_name
                    );
                    setSearchResults(teamNames);
                    console.log(teamNames);
                } catch (error) {
                    console.error("Error fetching names:", error);
                }
            }
        };

        if (teamName && !searchCompleted) {
            getSearchResults();
        } else {
            setSearchResults([]);
            setSearchCompleted(false);
        }
    }, [teamName]);

    const handleSuggestionClick = (suggestion, event) => {
        setTeamName(suggestion);
        setSearchResults([]);
        console.log(searchResults)
        event.stopPropagation();
        setSearchCompleted(true);
    };

    const handleInputChange = (event) => {
        setTeamName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // const response = await axios.get("team nba api link");
            // const response = {'data': {'id': 100}}
            let response = null
            if (deploymentStatus === "production") {
                response = await axios.get(
                    // "http://localhost:8000/api/players/get_team_id/",
                    "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_id/",
                    {
                        params: { team_name: teamName },
                    }
                );
            } else if (deploymentStatus === "development") {
                response = await axios.get(
                    "http://localhost:8000/api/players/get_team_id/",
                    // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_id/",
                    {
                        params: { team_name: teamName },
                    }
                );
            }
            // const response = await axios.get(
            //     "http://localhost:8000/api/players/get_team_id/",
            //     // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_id/",
            //     {
            //         params: { team_name: teamName },
            //     }
            // );
            console.log(response);
            console.log(response.data);
            const teamId = response.data.team_id;

            navigate(`/team/${teamId}`);
        } catch (error) {
            console.error("Error fetching team ID:", error);
            // Handle error, display error message, etc.
        }
    };

    return (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
            <label className={styles.searchLabel}>
                {"Search by Team Name: "}
            </label>
            <div className={styles.searchContent}>
                <input
                    type="text"
                    value={teamName}
                    onChange={handleInputChange}
                    placeholder="Enter team Name"
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchSubmit}>
                    <img
                        className={styles.searchImage}
                        src="/1200px-Magnifying_glass_icon.svg.png"
                        alt=""
                    />
                </button>
            </div>
            {searchResults.length > 0 && (
                <ul className={styles.searchResults}>
                    {searchResults.slice(0, 6).map((name, index) => (
                        <li
                            className={styles.searchResult}
                            key={index}
                            onClick={(event) =>
                                handleSuggestionClick(name, event)
                            }
                        >
                            {name}
                        </li>
                    ))}
                    {searchResults.length > 6 && <div className={styles.searchExtra}>...</div>}
                </ul>
            )}
        </form>
    );
};

const Home = () => {
    return (
        <>
            <Header />
            <div className={styles.body}>
                <h1 className={styles.websiteName}>
                    <div>
                        Welcome to{" "}
                        <span className={styles.websiteNamep1}>NBA</span>-
                        <span className={styles.websiteNamep2}>lytics</span>
                    </div>
                </h1>
                <PlayerSearchForm />
                <div style={{height:'2em'}}></div>
                <TeamSearchForm/>
            </div>
        </>
    );
};

export default Home;
