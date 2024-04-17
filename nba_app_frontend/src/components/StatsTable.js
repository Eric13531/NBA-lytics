import React, { useEffect, useState, useRef } from "react";
import styles from "./StatsTable.module.css"; // Import CSS Module for styling
import axios from "axios";
import { headerMapping, headerMeaning } from "../helper/constants";

const StatsTable = ({ playerId, season }) => {
    const [playerData, setPlayerData] = useState(null);
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
    const [tableWidth, setTableWidth] = useState(0);

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
        console.log("Season", season)
        // Create a ResizeObserver instance
        const tableElements = document.getElementById("table");
        const resizeObserver = new ResizeObserver((entries) => {
            // Get the width of the first observed element (the table)
            const tableWidth = entries[0].contentRect.width;
            console.log("Data: ", playerData);
            console.log("Width: ", tableWidth);
            if (div1Ref.current) {
                // && div2Ref.current
                // Set the width of div1 and div2 to match the width of the table
                div1Ref.current.style.width = `${tableWidth}px`;
                // div2Ref.current.style.width = `${tableWidth}px`;
            }
        });

        // Observe changes in the width of the table
        resizeObserver.observe(tableElements);

        // Cleanup resize observer when component unmounts
        return () => {
            resizeObserver.disconnect();
        };
    }, [playerData, season]);

    useEffect(() => {
        (async () => {
            setStatus("Loading")
            setPlayerData(null)
            setShouldHide(false)
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/players/get_all_player_game_stats/",
                    {
                        params: { player_id: playerId, season: season },
                    }
                );
                // setIndices([])
                const newHeaders = [];
                const indexArray = {};
                console.log(
                    "Header: ",
                    response.data.player_game_stats.headers
                );
                for (
                    let index = 0;
                    index < response.data.player_game_stats.headers.length;
                    index++
                ) {
                    const header =
                        response.data.player_game_stats.headers[index];
                    if (
                        headerMapping.hasOwnProperty(header) &&
                        headerMapping[header] !== "N/A"
                    ) {
                        newHeaders.push(headerMapping[header]);
                        // indexArray.push(index)
                        indexArray[index] = header;
                    }
                }

                for (
                    let game_idx = 0;
                    game_idx <
                    response.data.player_game_stats.game_stats.length;
                    game_idx++
                ) {
                    // const game of response.data.player_game_stats.game_stats) {
                    const game =
                        response.data.player_game_stats.game_stats[game_idx];
                    const gameArray = [];
                    for (let stat_idx = 0; stat_idx < game.length; stat_idx++) {
                        if (indexArray.hasOwnProperty(stat_idx)) {
                            const headerName =
                                headerMapping[
                                    response.data.player_game_stats.headers[
                                        stat_idx
                                    ]
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
                                game[stat_idx] = formatNumberWithThreeDecimals(
                                    game[stat_idx]
                                );
                            } else if (headerName === "DATE") {
                                game[stat_idx] = game[stat_idx].split("T")[0];
                            }

                            // }
                            gameArray.push(game[stat_idx]);
                        }
                    }
                    response.data.player_game_stats.game_stats[game_idx] =
                        gameArray;
                }
                setStatus("Received");
                response.data.player_game_stats.headers = newHeaders;
                setPlayerData(response.data.player_game_stats);
                if (
                    response.data.player_game_stats &&
                    response.data.player_game_stats.game_stats &&
                    response.data.player_game_stats.game_stats.length === 0
                ) {
                    setShouldHide(true);
                }

                // setIndices(indexArray)
                console.log("Data received: ", status);
                console.log("Data received: ", response.data.player_game_stats);
                // console.log(indexArray)
            } catch (error) {
                console.log(error.message);
                if (
                    error.message ===
                    "We couldn't process the request. Please reload or try again later"
                ) {
                    console.log("API DOWN");
                    console.log("Error fetching player stats: ", error);
                    setStatus("API Down");
                } else {
                    console.log("Error fetching player stats: ", error);
                    setStatus("Error");
                }
            }
        })();
    }, [playerId, season]);

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

    return (
        <>
            {status === "Loading" && <h1>Loading...</h1>}
            {status === "API Down" && (
                <h1>
                    Our NBA API is down at the moment. Please reload or try
                    again later
                </h1>
            )}
            {status === "Error" && (
                <h1>
                    We couldn't process your request. Please reload or try again
                    later
                </h1>
            )}
            {playerData &&
                playerData.game_stats &&
                playerData.game_stats.length === 0 && (
                    <h1 style={{ textAlign: "center" }}>
                        No Data Found This Year
                    </h1>
                )}
            <div
                ref={wrapper1Ref}
                className={`${styles.wrapper1} ${
                    shouldHide ? styles.hidden : ""
                }`}
                onScroll={handleWrapper1Scroll}
            >
                <div ref={div1Ref} className={styles.div1}>
                    {""}
                </div>
            </div>
            <div
                ref={wrapper2Ref}
                className={`${styles.wrapper2} ${
                    shouldHide ? styles.hidden : ""
                }`}
                onScroll={handleWrapper2Scroll}
            >
                <div ref={div2Ref} className={styles.div2}>
                    {status === "Received" && (
                        <table id="table" style={{ borderSpacing: "0px" }}>
                            <thead>
                                <tr>
                                    {playerData.headers.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {playerData.game_stats.map(
                                    (rowData, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {rowData.map(
                                                (cellData, cellIndex) => (
                                                    <td
                                                        style={{
                                                            whiteSpace:
                                                                "nowrap",
                                                            borderStyle:
                                                                "solid",
                                                            borderWidth: "1px",
                                                            padding: "0.3em",
                                                            margin: "0px",
                                                            fontSize: "0.85em",
                                                            textAlign: "center",
                                                        }}
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
        </>
    );
};

export default StatsTable;
