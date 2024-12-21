import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import styles from "./TeamDetails.module.css";

const deploymentStatus = process.env.REACT_APP_DEPLOYMENTSTATUS;

const TeamDetails = () => {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [yearRange, setYearRange] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [teamInfo, setTeamInfo] = useState(null);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        (async () => {
            setYearRange([]);
            console.log(teamId);
            try {
                setStatus("loading");
                setImageUrl(`/team_pictures/${teamId}.svg`);
                let response = null
                if (deploymentStatus === "production") {
                    response = await axios.get(
                        // "http://localhost:8000/api/players/get_team_info_from_id/",
                        "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_info_from_id/",
                        {
                            params: { team_id: teamId },
                        }
                    );
                } else if (deploymentStatus === "development") {
                    response = await axios.get(
                        "http://localhost:8000/api/players/get_team_info_from_id/",
                        // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_info_from_id/",
                        {
                            params: { team_id: teamId },
                        }
                    );
                }
                // response = await axios.get(
                //     "http://localhost:8000/api/players/get_team_info_from_id/",
                //     // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_info_from_id/",
                //     {
                //         params: { team_id: teamId },
                //     }
                // );
                const team_info = response.data.team_info;
                const first_year = parseInt(
                    team_info.first_season.split("-")[0]
                );
                const last_year = parseInt(team_info.last_season.split("-")[0]);
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
                        // "http://localhost:8000/api/players/get_team_info_from_id/",
                        "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_info_from_id/",
                        {
                            params: { team_id: teamId },
                        }
                    );
                } else if (deploymentStatus === "development") {
                    info_response = await axios.get(
                        "http://localhost:8000/api/players/get_team_info_from_id/",
                        // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_info_from_id/",
                        {
                            params: { team_id: teamId },
                        }
                    );
                }
                // const info_response = await axios.get(
                //     "http://localhost:8000/api/players/get_team_advanced_info_from_id/",
                //     // "https://nba-lytics-django-413a47ec986b.herokuapp.com/api/players/get_team_advanced_info_from_id/",
                //     {
                //         params: { team_id: teamId },
                //     }
                // );
                const team_common_info = info_response.data.team_common_info;
                console.log(team_common_info);
                setTeamInfo(team_common_info);
                console.log(team_info);
                setTeam(team_info);
                setYearRange(years);
            } catch (error) {
                console.error("Error fetching team data:", error);
                setStatus("Error");
            }
        })();
    }, [teamId]);

    return (
        <div>
            <Header />
            <div className={styles.playerBody}>
                {team && (
                    <>
                        <div className={styles.profile}>
                            <div className={styles.profileImageContainer}>
                                <img
                                    src={imageUrl}
                                    alt={team.full_name}
                                    className={styles.profileImage}
                                ></img>
                            </div>
                            <div className={styles.profileData}>
                                <h1 className={styles.profileName}>
                                    {team.full_name}
                                </h1>
                                <div className={styles.profileText}>
                                    Abbreviation: {teamInfo.abb}
                                </div>
                                <div className={styles.profileText}>
                                    Location: {teamInfo.city}, {teamInfo.state}
                                </div>
                                <div className={styles.profileText}>
                                    Conference-Division: {teamInfo.conference}-
                                    {teamInfo.division}
                                </div>
                                <div className={styles.profileText}>
                                    First Season: {teamInfo.first_season}
                                </div>
                                <div className={styles.profileText}>
                                    Championships: {teamInfo.championships}
                                </div>
                                {/* <h2>
                                Still Active: {player.is_active ? "YES" : "NO"}
                            </h2> */}
                            </div>
                        </div>
                        <div className={styles.horizontalLine}></div>
                        <div className={styles.gameLogBody}>
                            {/* <div className={styles.gameLogTitle}>
                                <Link to={"season"}>Accolades</Link>
                            </div> */}
                            <div className={styles.gameLogTitle}>
                                <Link to={"season"}>Season Statistics</Link>
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
                {!team && status === "loading" && <h1>Loading...</h1>}
                {!team && status === "Error" && <h1>Error Response</h1>}
            </div>
        </div>
    );
};

export default TeamDetails;
