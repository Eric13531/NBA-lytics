import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import styles from "./TeamSeasons.module.css";
import {
    seasonHeaderMapping,
    headerMeaning,
    defaultHeaders,
} from "../helper/constants";

const TeamSeasons = () => {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);

    useEffect(() => {
        (async () => {
            console.log(teamId);
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/players/get_team_info_from_id/",
                    {
                        params: { team_id: teamId },
                    }
                );
                const team_info = response.data.team_info;
                // const first_year = parseInt(
                //     team_info.first_season.split("-")[0]
                // );
                // const last_year = parseInt(
                //     team_info.last_season.split("-")[0]
                // );
                // let years = [];

                // for (let year = first_year; year <= last_year; year++) {
                //     years.push(
                //         `${year}-${(year + 1) % 100 < 10 ? "0" : ""}${
                //             (year + 1) % 100
                //         }`
                //     );
                // }

                console.log(team_info);
                setTeam(team_info);
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        })();
    }, [teamId]);

    const StatsTable = ({ teamId }) => {
        const [teamData, setTeamData] = useState(null);
        const defaultHeaders = ["Year", "Tm"];
        const [headers, setHeader] = useState(defaultHeaders);
        // const []
        const [status, setStatus] = useState("Loading");
        const [shouldHide, setShouldHide] = useState(false);
        // we want to hide the table if no games played that year
        const wrapper1Ref = useRef(null);
        const wrapper2Ref = useRef(null);
        const div1Ref = useRef(null);
        const div2Ref = useRef(null);
        const wrapper1RefP = useRef(null);
        const wrapper2RefP = useRef(null);
        const div1RefP = useRef(null);
        const div2RefP = useRef(null);
        const wrapper1RefT = useRef(null);
        const wrapper2RefT = useRef(null);
        const div1RefT = useRef(null);
        const div2RefT = useRef(null);
        const subtitleRef = useRef(null);
        const subtitleRefP = useRef(null);
        const subtitleRefT = useRef(null);
        const [tableWidth, setTableWidth] = useState(0);
        const [tableWidthP, setTableWidthP] = useState(0);

        const changeRow = (row) => {
            return row;
        };

        function reduceToOneDecimal(num) {
            if (Math.floor(num).toString().length >= 3) {
                return Math.floor(num);
            } else {
                let roundedNum = Math.round(num * 10) / 10;
                return roundedNum % 1 === 0 ? roundedNum + ".0" : roundedNum;
            }
        }

        function formatNumberWithThreeDecimals(number) {
            if (number === null) {
                return null;
            }
            // console.log("fix", number);
            var formattedNumber = number.toFixed(3);
            if (!formattedNumber.includes(".")) {
                formattedNumber += ".000";
            }
            var decimalPart = formattedNumber.split(".")[1];
            return "." + decimalPart;
        }

        useEffect(() => {
            // console.log("Season", season);
            // Create a ResizeObserver instance
            const tableElements = document.getElementById("table");
            const resizeObserver = new ResizeObserver((entries) => {
                // Get the width of the first observed element (the table)
                const tableWidth = entries[0].contentRect.width;
                // console.log("Data: ", teamData);
                // console.log("Width: ", tableWidth);
                if (div1Ref.current) {
                    // && div2Ref.current
                    // Set the width of div1 and div2 to match the width of the table
                    div1Ref.current.style.width = `${tableWidth}px`;
                    handleWindowResize();
                    // const maxWidth = 0.9 * window.innerWidth
                    // subtitleRef.current.style.width = `${Math.min(tableWidth, maxWidth)}px`;
                    // div2Ref.current.style.width = `${tableWidth}px`;
                }
            });

            // Observe changes in the width of the table
            resizeObserver.observe(tableElements);

            const tableElementsP = document.getElementById("tableP");
            const resizeObserverP = new ResizeObserver((entries) => {
                // Get the width of the first observed element (the table)
                const tableWidth = entries[0].contentRect.width;
                // console.log("Data: ", teamData);
                // console.log("Width: ", tableWidth);
                if (div1RefP.current) {
                    // && div2Ref.current
                    // Set the width of div1 and div2 to match the width of the table
                    div1RefP.current.style.width = `${tableWidth}px`;
                    handleWindowResize();
                    // div2Ref.current.style.width = `${tableWidth}px`;
                }
            });

            // Observe changes in the width of the table
            resizeObserverP.observe(tableElementsP);

            // Cleanup resize observer when component unmounts
            return () => {
                resizeObserver.disconnect();
                resizeObserverP.disconnect();
            };
        }, [teamData]);

        const handleWindowResize = () => {
            const referenceElement = document.getElementById("playerBody");
            const tableElement = document.getElementById("table");
            const tableElementP = document.getElementById("tableP");
            // console.log(subtitleRef.current)
            if (subtitleRef && subtitleRef.current) {
                subtitleRef.current.style.width = `${Math.min(
                    tableElement.offsetWidth,
                    referenceElement.offsetWidth
                )}px`;
            }
            if (subtitleRefP && subtitleRefP.current) {
                subtitleRefP.current.style.width = `${Math.min(
                    tableElementP.offsetWidth,
                    referenceElement.offsetWidth
                )}px`;
            }
        };

        window.addEventListener("resize", handleWindowResize);

        useEffect(() => {
            (async () => {
                setStatus("Loading");
                setTeamData(null);
                setShouldHide(false);
                try {
                    const response = await axios.get(
                        "http://localhost:8000/api/players/get_team_career_averages/",
                        {
                            params: { team_id: teamId },
                        }
                    );
                    // setIndices([])
                    const newHeaders = [];
                    const indexArray = {};
                    const newHeadersP = [];
                    const indexArrayP = {};
                    const newHeadersT = [];
                    const indexArrayT = {};
                    console.log("Header: ", response.data.team_career_stats);
                    for (
                        let index = 0;
                        index <
                        response.data.team_career_stats.headers.length;
                        index++
                    ) {
                        const header =
                            response.data.team_career_stats.headers[index];
                        if (
                            seasonHeaderMapping.hasOwnProperty(header) &&
                            seasonHeaderMapping[header] !== "N/A"
                        ) {
                            newHeaders.push(seasonHeaderMapping[header]);
                            // indexArray.push(index)
                            indexArray[index] = header;

                            newHeadersT.push(seasonHeaderMapping[header]);
                            indexArrayT[index] = header;
                        }
                    }

                    for (
                        let index = 0;
                        index <
                        response.data.team_career_stats.headers_playoffs
                            .length;
                        index++
                    ) {
                        const header =
                            response.data.team_career_stats.headers_playoffs[
                                index
                            ];
                        if (
                            seasonHeaderMapping.hasOwnProperty(header) &&
                            seasonHeaderMapping[header] !== "N/A"
                        ) {
                            newHeadersP.push(seasonHeaderMapping[header]);
                            // indexArray.push(index)
                            indexArrayP[index] = header;
                        }
                    }

                    for (
                        let game_idx = 0;
                        game_idx <
                        response.data.team_career_stats.career_stats.length;
                        game_idx++
                    ) {
                        // const game of response.data.team_career_stats.career_stats) {
                        const game =
                            response.data.team_career_stats.career_stats[
                                game_idx
                            ];
                        const gameArray = [];
                        for (
                            let stat_idx = 0;
                            stat_idx < game.length;
                            stat_idx++
                        ) {
                            if (indexArray.hasOwnProperty(stat_idx)) {
                                const headerName =
                                    seasonHeaderMapping[
                                        response.data.team_career_stats
                                            .headers[stat_idx]
                                    ];
                                if (headerName === "MIN") {
                                    game[stat_idx] = reduceToOneDecimal(
                                        game[stat_idx]
                                    );
                                } else if (
                                    headerName === "FG%" ||
                                    headerName === "3P%" ||
                                    headerName === "FT%"
                                ) {
                                    game[stat_idx] =
                                        formatNumberWithThreeDecimals(
                                            game[stat_idx]
                                        );
                                } else if (headerName === "DATE") {
                                    game[stat_idx] =
                                        game[stat_idx].split("T")[0];
                                }

                                // }
                                gameArray.push(game[stat_idx]);
                            }
                        }
                        response.data.team_career_stats.career_stats[
                            game_idx
                        ] = gameArray;
                    }

                    for (
                        let game_idx = 0;
                        game_idx <
                        response.data.team_career_stats.career_stats_playoffs
                            .length;
                        game_idx++
                    ) {
                        // const game of response.data.team_career_stats.career_stats) {
                        const game =
                            response.data.team_career_stats
                                .career_stats_playoffs[game_idx];
                        const gameArray = [];
                        for (
                            let stat_idx = 0;
                            stat_idx < game.length;
                            stat_idx++
                        ) {
                            if (indexArrayP.hasOwnProperty(stat_idx)) {
                                const headerName =
                                    seasonHeaderMapping[
                                        response.data.team_career_stats
                                            .headers[stat_idx]
                                    ];
                                if (headerName === "MIN") {
                                    game[stat_idx] = reduceToOneDecimal(
                                        game[stat_idx]
                                    );
                                } else if (
                                    headerName === "FG%" ||
                                    headerName === "3P%" ||
                                    headerName === "FT%"
                                ) {
                                    game[stat_idx] =
                                        formatNumberWithThreeDecimals(
                                            game[stat_idx]
                                        );
                                } else if (headerName === "DATE") {
                                    game[stat_idx] =
                                        game[stat_idx].split("T")[0];
                                }

                                // }
                                gameArray.push(game[stat_idx]);
                            }
                        }
                        response.data.team_career_stats.career_stats_playoffs[
                            game_idx
                        ] = gameArray;
                    }
                    
                    // TODO: Implement Regular season + Playoff combined averages
                    // for (
                    //     let game_idx = 0;
                    //     game_idx <
                    //     response.data.team_career_stats.career_stats_playoffs
                    //         .length;
                    //     game_idx++
                    // ) {
                    //     // const game of response.data.team_career_stats.career_stats) {
                    //     const game =
                    //         response.data.team_career_stats
                    //             .career_stats_playoffs[game_idx];
                    //     const gameArray = [];
                    //     for (
                    //         let stat_idx = 0;
                    //         stat_idx < game.length;
                    //         stat_idx++
                    //     ) {
                    //         if (indexArrayP.hasOwnProperty(stat_idx)) {
                    //             const headerName =
                    //                 seasonHeaderMapping[
                    //                     response.data.team_career_stats
                    //                         .headers[stat_idx]
                    //                 ];
                    //             if (headerName === "MIN") {
                    //                 game[stat_idx] = reduceToOneDecimal(
                    //                     game[stat_idx]
                    //                 );
                    //             } else if (
                    //                 headerName === "FG%" ||
                    //                 headerName === "3P%" ||
                    //                 headerName === "FT%"
                    //             ) {
                    //                 game[stat_idx] =
                    //                     formatNumberWithThreeDecimals(
                    //                         game[stat_idx]
                    //                     );
                    //             } else if (headerName === "DATE") {
                    //                 game[stat_idx] =
                    //                     game[stat_idx].split("T")[0];
                    //             }

                    //             // }
                    //             gameArray.push(game[stat_idx]);
                    //         }
                    //     }
                    //     response.data.team_career_stats.career_stats_playoffs[
                    //         game_idx
                    //     ] = gameArray;
                    // }
                    setStatus("Received");
                    response.data.team_career_stats.headers = newHeaders;
                    response.data.team_career_stats.headers_playoffs =
                        newHeaders;
                    setTeamData(response.data.team_career_stats);
                    // setOptions(newHeaders);
                    // setSelectedOptions(defaultHeaders.filter(value => !newHeaders.includes(value)));
                    if (
                        response.data.team_career_stats &&
                        response.data.team_career_stats.career_stats &&
                        response.data.team_career_stats.career_stats
                            .length === 0 &&
                        response.data.team_career_stats
                            .career_stats_playoffs &&
                        response.data.team_career_stats.career_stats_playoffs
                            .length === 0
                    ) {
                        console.log("HIDDEN");
                        setShouldHide(true);
                    }

                    // setIndices(indexArray)
                    console.log("Data received: ", status);
                    console.log(
                        "Data received: ",
                        response.data.team_career_stats
                    );
                    // console.log(indexArray)
                } catch (error) {
                    console.log(error.message);
                    if (
                        error.message ===
                        "We couldn't process the request. Please reload or try again later"
                    ) {
                        console.log("API DOWN");
                        console.log("Error fetching team stats: ", error);
                        setStatus("API Down");
                    } else {
                        console.log("Error fetching team stats: ", error);
                        setStatus("Error");
                    }
                }
            })();
        }, [teamId]);

        const handleWrapper1Scroll = () => {
            if (wrapper2Ref.current) {
                wrapper2Ref.current.scrollLeft = wrapper1Ref.current.scrollLeft;
            }
        };

        const handleWrapper2Scroll = () => {
            if (wrapper1Ref.current) {
                wrapper1Ref.current.scrollLeft = wrapper2Ref.current.scrollLeft;
            }
        };

        const handleWrapper1ScrollP = () => {
            if (wrapper2RefP.current) {
                wrapper2RefP.current.scrollLeft =
                    wrapper1RefP.current.scrollLeft;
            }
        };

        const handleWrapper2ScrollP = () => {
            if (wrapper1RefP.current) {
                wrapper1RefP.current.scrollLeft =
                    wrapper2RefP.current.scrollLeft;
            }
        };

        return (
            <>
                {status === "Loading" && <h1>Loading Team Stats...</h1>}
                {status === "API Down" && (
                    <h1>
                        Our NBA API is down at the moment. Please reload or try
                        again later
                    </h1>
                )}
                {status === "Error" && (
                    <h1>
                        We couldn't process your request. Please reload or try
                        again later
                    </h1>
                )}
                {teamData &&
                    teamData.career_stats &&
                    teamData.career_stats.length === 0 &&
                    teamData.career_stats_playoffs &&
                    teamData.career_stats_playoffs.length === 0 && (
                        <h1 style={{ textAlign: "center" }}>
                            No Data Found This Year
                        </h1>
                    )}
                {/* REGULAR SEASON DATA*/}
                <h2
                    ref={subtitleRef}
                    className={`${styles.subtitle}`}
                >{`Regular Season Stats`}</h2>
                <div
                    ref={wrapper1Ref}
                    className={`${styles.tableWrapper1} ${
                        teamData &&
                        teamData.career_stats &&
                        teamData.career_stats.length === 0
                            ? styles.hidden
                            : ""
                    }`}
                    onScroll={handleWrapper1Scroll}
                >
                    <div ref={div1Ref} className={styles.tableDiv1}>
                        {""}
                    </div>
                </div>
                <div
                    ref={wrapper2Ref}
                    className={`${styles.tableWrapper2} ${
                        teamData &&
                        teamData.career_stats &&
                        teamData.career_stats.length === 0
                            ? styles.hidden
                            : ""
                    }`}
                    onScroll={handleWrapper2Scroll}
                >
                    <div ref={div2Ref} className={styles.tableDiv2}>
                        {status === "Received" && (
                            <table id="table" style={{ borderSpacing: "0px" }}>
                                <thead>
                                    <tr>
                                        {teamData.headers.map(
                                            (header, index) => (
                                                <th
                                                    className={styles.header}
                                                    key={index}
                                                >
                                                    {header}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamData.career_stats.map(
                                        (rowData, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {rowData.map(
                                                    (cellData, cellIndex) => (
                                                        <td
                                                            className={
                                                                styles.cell
                                                            }
                                                            key={cellIndex}
                                                        >
                                                            {cellData
                                                                ? cellData
                                                                : "-"}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        )}
                        {status !== "Received" && (
                            // Placeholder so error doesn't occur
                            <div id="table"></div>
                        )}
                    </div>
                </div>

                {/* PLAYOFFS DATA*/}

                <h2
                    ref={subtitleRefP}
                    className={`${styles.subtitle}`}
                >{`Playoff Stats`}</h2>
                <div
                    ref={wrapper1RefP}
                    className={`${styles.tableWrapper1} ${
                        teamData &&
                        teamData.career_stats_playoffs &&
                        teamData.career_stats_playoffs.length === 0
                            ? styles.hidden
                            : ""
                    }`}
                    onScroll={handleWrapper1ScrollP}
                >
                    <div ref={div1RefP} className={styles.tableDiv1}>
                        {""}
                    </div>
                </div>
                <div
                    ref={wrapper2RefP}
                    className={`${styles.tableWrapper2} ${
                        teamData &&
                        teamData.career_stats_playoffs &&
                        teamData.career_stats_playoffs.length === 0
                            ? styles.hidden
                            : ""
                    }`}
                    onScroll={handleWrapper2ScrollP}
                >
                    <div ref={div2RefP} className={styles.tableDiv2}>
                        {status === "Received" && (
                            <table id="tableP" style={{ borderSpacing: "0px" }}>
                                <thead>
                                    <tr>
                                        {teamData.headers.map(
                                            (header, index) => (
                                                <th
                                                    className={styles.header}
                                                    key={index}
                                                >
                                                    {header}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamData.career_stats_playoffs.map(
                                        (rowData, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {rowData.map(
                                                    (cellData, cellIndex) => (
                                                        <td
                                                            className={
                                                                styles.cell
                                                            }
                                                            key={cellIndex}
                                                        >
                                                            {cellData
                                                                ? cellData
                                                                : "-"}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        )}
                        {status !== "Received" && (
                            // Placeholder so error doesn't occur
                            <div id="tableP"></div>
                        )}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div>
            <Header />
            <div className={styles.body}>
                <div id="playerBody" className={styles.playerBody}>
                    {team && (
                        <>
                            <h1 className={styles.playerName}>
                                {team.full_name} Stats
                            </h1>
                            <Link
                                className={styles.playerLink}
                                to={`/team/${team.id}`}
                            >
                                Back to Profile
                            </Link>

                            <div className={styles.settingsBody}>
                                {/* <div className={styles.setting}>
                                    <div className={styles.gameLogTitle}>
                                        Game Logs:
                                    </div>

                                    <select 
                                            value={`${season}-${
                                                (parseInt(season) + 1) % 100 < 10
                                                    ? "0"
                                                    : ""
                                            }${(parseInt(season) + 1) % 100}`}
                                            onChange={handleSelect}>
                                        <option>
                                            Select a page
                                        </option>
                                        {yearRange.map((year, index) => (
                                            <option
                                                key={index}
                                                value={`${year.split("-")[0]}`}
                                            >
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}

                                {/* <div className={styles.setting}>
                                    <div className={styles.gameLogTitle}>
                                        Headers:
                                    </div>

                                    <select onChange={handleSelectHeaders}>
                                        <option value="">Select headers</option>
                                        <option
                                            value="Default"
                                        >
                                            Default
                                        </option>
                                        <option
                                            value="All Stats"
                                        >
                                            All Stats
                                        </option>
                                    </select>
                                </div> */}
                                {/* <div className={styles.gameLogLinks}>
                                {yearRange.map((year, index) => (
                                    <Link
                                        key={index}
                                        className={styles.gameLogLink}
                                        to={`./../${year.split("-")[0]}`}
                                    >
                                        {year}
                                    </Link>
                                ))}
                            </div> */}
                            </div>

                            <StatsTable teamId={teamId} />
                        </>
                    )}
                    {!team && <h1>Loading Team Info...</h1>}
                </div>
            </div>
        </div>
    );
};

export default TeamSeasons;
