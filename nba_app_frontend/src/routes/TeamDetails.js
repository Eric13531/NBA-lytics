import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import styles from "./TeamDetails.module.css";

const TeamDetails = () => {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [yearRange, setYearRange] = useState([]);

    useEffect(() => {
        (async () => {
            setYearRange([]);
            console.log(teamId);
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/players/get_team_info_from_id/",
                    {
                        params: { team_id: teamId },
                    }
                );
                const team_info = response.data.team_info;
                const first_year = parseInt(
                    team_info.first_season.split("-")[0]
                );
                const last_year = parseInt(
                    team_info.last_season.split("-")[0]
                );
                let years = [];

                for (let year = first_year; year <= last_year; year++) {
                    years.push(
                        `${year}-${(year + 1) % 100 < 10 ? "0" : ""}${
                            (year + 1) % 100
                        }`
                    );
                }

                console.log(team_info);
                setTeam(team_info);
                setYearRange(years);
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        })();
    }, [teamId]);

    return (
        <div>
            <Header />
            <div className={styles.playerBody}>
                {team && (
                    <>
                        <h1>{team.full_name}</h1>
                        <h2>Still Active: {team.is_active ? "YES" : "NO"}</h2>
                        <Link to={'season'}><div className={styles.gameLogTitle}>Season Averages</div></Link>
                        <div className={styles.gameLogBody}>
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
                {!team && <h1>Loading...</h1>}
            </div>
        </div>
    );
};

export default TeamDetails;
