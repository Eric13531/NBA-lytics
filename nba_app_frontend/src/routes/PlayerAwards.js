import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import styles from "./PlayerAwards.module.css";
import { awardMapping } from "../helper/constants";

const PlayerAwards = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState(null);
    const [yearRange, setYearRange] = useState([]);

    const [imageUrl, setImageUrl] = useState(null);
    const [playerAwards, setPlayerAwards] = useState(null);
    const [status, setStatus] = useState("loading");
    const [hasAwards, setHasAwards] = useState(false);

    useEffect(() => {
        (async () => {
            setYearRange([]);
            console.log(playerId);
            try {
                setHasAwards(false)
                setStatus("loading");
                const response = await axios.get(
                    "http://localhost:8000/api/players/get_player_info_from_id/",
                    {
                        params: { player_id: playerId },
                    }
                );
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
                const info_response = await axios.get(
                    "http://localhost:8000/api/players/get_player_awards/",
                    {
                        params: { player_id: playerId },
                    }
                );
                const player_awards = info_response.data.award_set;
                let new_player_awards = {}
                for (const key in player_awards) {
                    // console.log("help", player_awards[key], Array.isArray(player_awards[key]))
                    if (awardMapping[key] === "N/A") {
                        continue
                    }
                    if (!awardMapping.hasOwnProperty(key)){
                        let num = 1 / 0
                        console.log("NUM", num.help.help)
                    }
                    if (player_awards[key].length > 0) {
                        console.log('yeees')
                        setHasAwards(true)
                    }
                    new_player_awards[awardMapping[key]] = player_awards[key]
                }

                let sort_player_awards = {}
                sort_player_awards['Most Valuable Player'] = new_player_awards['Most Valuable Player']
                sort_player_awards['Finals Most Valuable Player'] = new_player_awards['Finals Most Valuable Player']
                sort_player_awards['Defensive Player of the Year'] = new_player_awards['Defensive Player of the Year']
                sort_player_awards['Rookie of the Year'] = new_player_awards['Rookie of the Year']
                sort_player_awards['All-Star Most Valuable Player'] = new_player_awards['All-Star Most Valuable Player']
                sort_player_awards['All-NBA'] = new_player_awards['All-NBA']
                sort_player_awards['All-Defensive Team'] = new_player_awards['All-Defensive Team']
                sort_player_awards['All-Rookie Team'] = new_player_awards['All-Rookie Team']
                sort_player_awards['Olympic Gold Medal'] = new_player_awards['Olympic Gold Medal']

                for (const key in new_player_awards) {
                    if (!sort_player_awards.hasOwnProperty(key)) {
                        sort_player_awards[key] = new_player_awards[key]
                    }
                }

                console.log("old", new_player_awards);
                console.log("new", sort_player_awards);
                setPlayerAwards(sort_player_awards);

                // console.log(player_info);
                setPlayer(player_info);
                console.log("YEAR", years)
                setYearRange(years);
                setStatus("Retrieved")
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
            <div className={styles.body} style={{marginBottom : '3em'}}>
                {player && (
                    <div className={styles.awardsBody}>
                    <h1 className={styles.playerName}>
                        {player.full_name} Awards
                    </h1>
                    <Link
                        className={styles.playerLink}
                        to={`/player/${player.id}`}
                    >
                        Back to Profile
                    </Link>
                    
                    {hasAwards && status === "Retrieved" && <div className={styles.awardsListBody}>
                        {Object.entries(playerAwards).map(([award, years], index) => (
                            <div key={index}>
                            {years && years.length > 0 && 
                                <div className={styles.awardsEntry}>
                                    {(award === "Hall of Fame" || award === "Rookie of the Year" || award === "All-Rookie Team") && <h3 className={styles.awardsTitle}>{award}</h3>}
                                    {!(award === "Hall of Fame" || award === "Rookie of the Year" || award === "All-Rookie Team") && <h3 className={styles.awardsTitle}>{years.length}x {award}</h3>}
                                    <div className={styles.awardsYears}>
                                        {years.map((year, index) => (
                                            <div key={index} className={styles.awardsYear}>{yearRange.includes(year) && <Link to={`./../stats/${year.split('-')[0]}`}>{year}</Link>}
                                            {!yearRange.includes(year) && <div>{year}</div>}</div>
                                        ))}
                                    </div>
                                </div>
                            }
                            </div>
                        ))}
                    </div>}
                    {!hasAwards && status === "Retrieved" && <h2>Player has no awards :(</h2>}
                {/* {!player && status === "loading" && <h1>Loading...</h1>}
                {!player && status === "Error" && <h1>Error Response</h1>} */}
                    </div>
                )}
                {!player && status === "loading" && <h1>Loading...</h1>}
                {!player && status === "Error" && <h1>Error Response</h1>}

            </div>
        </div>
    );
};

export default PlayerAwards;
