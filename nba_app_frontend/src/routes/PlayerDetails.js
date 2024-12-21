import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import styles from "./PlayerDetails.module.css";

const deploymentStatus = process.env.REACT_APP_DEPLOYMENTSTATUS;

const PlayerDetails = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState(null);
    const [yearRange, setYearRange] = useState([]);

    const [imageUrl, setImageUrl] = useState(null);
    const [playerInfo, setPlayerInfo] = useState(null);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        (async () => {
            setYearRange([]);
            console.log(playerId);
            try {
                setStatus("loading");
                setImageUrl(`/player_pictures/${playerId}.png`);
                let response = null
                if (deploymentStatus === "production") {
                    response = await axios.get(
                        // "http://localhost:8000/api/players/get_player_info_from_id/",
                        "http://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_info_from_id/",
                        {
                            params: { player_id: playerId },
                        }
                    );
                } else if (deploymentStatus === "development") {
                    response = await axios.get(
                        "http://localhost:8000/api/players/get_player_info_from_id/",
                        // "http://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_info_from_id/",
                        {
                            params: { player_id: playerId },
                        }
                    );
                }
                // const response = await axios.get(
                //     "http://localhost:8000/api/players/get_player_info_from_id/",
                //     // "http://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_info_from_id/",
                //     {
                //         params: { player_id: playerId },
                //     }
                // );
                const player_info = response.data.player_info;
                const first_year = parseInt(
                    player_info.first_season.split("-")[0]
                );
                const last_year = parseInt(
                    player_info.last_season.split("-")[0]
                );
                let years = [];

                for (let year = first_year; year <= last_year; year++) {
                    years.push(
                        `${year}-${(year + 1) % 100 < 10 ? "0" : ""}${
                            (year + 1) % 100
                        }`
                    );
                }
                let info_response = null
                if (deploymentStatus === "production") {
                    info_response = await axios.get(
                        // "http://localhost:8000/api/players/get_player_advanced_info_from_id/",
                        "http://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_advanced_info_from_id/",
                        {
                            params: { player_id: playerId },
                        }
                    );
                } else if (deploymentStatus === "development") {
                    info_response = await axios.get(
                        "http://localhost:8000/api/players/get_player_advanced_info_from_id/",
                        // "http://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_advanced_info_from_id/",
                        {
                            params: { player_id: playerId },
                        }
                    );
                }
                // const info_response = await axios.get(
                //     "http://localhost:8000/api/players/get_player_advanced_info_from_id/",
                //     // "http://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_player_advanced_info_from_id/",
                //     {
                //         params: { player_id: playerId },
                //     }
                // );
                const player_common_info =
                    info_response.data.player_common_info;
                console.log(player_common_info);
                setPlayerInfo(player_common_info);

                console.log(player_info);
                setPlayer(player_info);
                setYearRange(years);
            } catch (error) {
                console.error("Error fetching player data:", error);
                setStatus("Error");
            }
        })();
    }, [playerId]);

    const handleImageError = () => {
        console.log("ERROR", imageUrl);
        setImageUrl("/blank_person.jpg");
    };

    return (
        <div>
            <Header />
            <div className={styles.playerBody}>
                {player && (
                    <>
                        <div className={styles.profile}>
                            <div className={styles.profileImageContainer}>
                                <img
                                    src={imageUrl}
                                    alt={player.full_name}
                                    className={
                                        imageUrl === "/blank_person.jpg"
                                            ? styles.blankImage
                                            : styles.profileImage
                                    }
                                    onError={handleImageError}
                                ></img>
                            </div>
                            <div className={styles.profileData}>
                                <h1 className={styles.profileName}>
                                    {player.full_name}
                                </h1>
                                <div
                                    style={{ fontWeight: "700" }}
                                    className={styles.profileText}
                                >
                                    Still Active:{" "}
                                    {player.is_active ? "YES" : "NO"}
                                </div>
                                <div className={styles.profileText}>
                                    Birthdate: {playerInfo.birthdate}
                                </div>
                                <div className={styles.profileText}>
                                    Country: {playerInfo.country}
                                </div>
                                <div className={styles.profileText}>
                                    Height: {playerInfo.height} (
                                    {playerInfo.height_cm}cm)
                                </div>
                                <div className={styles.profileText}>
                                    Weight: {playerInfo.weight}lbs (
                                    {playerInfo.weight_kg}kg)
                                </div>
                                {/* <h2>
                                Still Active: {player.is_active ? "YES" : "NO"}
                            </h2> */}
                            </div>
                        </div>
                        <div className={styles.horizontalLine}></div>
                        <div className={styles.gameLogBody}>
                            <div className={styles.gameLogTitle}>
                                <Link to={"award"}>Accolades</Link>
                            </div>
                            <div className={styles.gameLogTitle}>
                                <Link to={"season"}>Season Averages</Link>
                            </div>
                            <div className={styles.gameLogTitle}>
                                Game Logs:
                            </div>
                            <div className={styles.gameLogLinks}>
                                {yearRange.map((year, index) => (
                                    <Link
                                        key={index}
                                        className={styles.gameLogLink}
                                        to={`stats/${year.split("-")[0]}`}
                                    >
                                        {year}
                                    </Link>
                                ))}
                                {/* <Link style={{margin:'1em'}} to="stats">View Stats</Link>
                            <Link style={{margin:'1em'}} to="stats">View Stats</Link> */}
                            </div>
                        </div>
                    </>
                )}
                {!player && status === "loading" && <h1>Loading...</h1>}
                {!player && status === "Error" && <h1>Error Response</h1>}
            </div>
        </div>
    );
};

export default PlayerDetails;
