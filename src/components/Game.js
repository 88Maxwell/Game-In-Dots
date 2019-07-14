import React from "react";
import { settings as settingsApi } from "../api";
import Square from "./Square";

import style from "./game.module.css";

export default class Game extends React.Component {
    state = {
        error             : "",
        isLoading         : true,
        settings          : {},
        mode              : "",
        name              : "",
        board             : [],
        activeFieldNumber : null,
        isPlay            : false
    };

    async componentDidMount() {
        const settings = await settingsApi.list();

        if (!settings) {
            return this.setState({ error: "connection error" });
        }
        const firstModeKey = Object.keys(settings)[0];

        this.setState({
            settings,
            mode      : firstModeKey,
            board     : this.generateBoardMatrix(settings[firstModeKey].field ** 2),
            isLoading : false
        });
    }

    handleChangeMode = evt => {
        const { settings } = this.state;
        const { value } = evt.target;

        this.setState({
            board : this.generateBoardMatrix(settings[value].field ** 2),
            mode  : value
        });
    };

    handleChange = param => evt => this.setState({ [param]: evt.target.value });

    handlePlay = () => {
        const { mode, settings } = this.state;
        const { delay } = settings[mode];

        let light = true;

        const gameInteraval = setInterval(() => {
            const { board } = this.state;
            const newBoard = [ ...board ];


            if (light) {
                this.checkWinners(gameInteraval);
                const indexesOfPending = [];

                board.forEach((elem, index) => {
                    if (elem.status === "PENDING") {
                        indexesOfPending.push(index);
                    }
                });
                const indexOfRandomPending =
                    indexesOfPending[getRandomInt(0, indexesOfPending.length)];

                newBoard[indexOfRandomPending].status = "ACTIVE";
                this.setState({ board: newBoard });
                light = false;
            } else {
                const indexOfActiveSquare = newBoard.findIndex(
                    el => el.status === "ACTIVE"
                );

                if (indexOfActiveSquare !== -1) {
                    newBoard[indexOfActiveSquare].status = "COMPUTER";
                    this.setState({ board: newBoard });
                }
                light = true;
            }
        }, delay / 4);
    };

    pointOf = (who, board) =>
        board.reduce((accumalator, elem) => elem.status === who ? 1 + accumalator : accumalator, 0);

    checkWinners = gameInteraval => {
        const { settings, mode, board } = this.state;
        const { field } = settings[mode];
        const computerScore = this.pointOf("COMPUTER", board);
        const userScore = this.pointOf("USER", board);

        console.log(computerScore);
        if (Math.floor((field ** 2) / 2) < computerScore) {
            clearInterval(gameInteraval);
            // eslint-disable-next-line
            alert("YOU ARE LOSE");
        } else if (Math.floor(field ** 2) < userScore) {
            clearInterval(gameInteraval);
            // eslint-disable-next-line
            alert("YOU ARE WIN");
        }
    };

    generateBoardMatrix = countOfField =>
        Array.from(Array(countOfField)).map(() => ({ status: "PENDING" }));

    generateGameBoard = () => {
        const { isLoading, mode, name, board, settings, error } = this.state;

        if (isLoading) {
            return <p>isLoading ...</p>;
        }

        if (error) {
            return <p>{error}</p>;
        }
        const modes = settings && Object.keys(settings);
        const boardSize = settings[mode].field;

        return settings ? (
            <>
                <h1>Game</h1>
                <select
                    value={mode ? mode : modes[0]}
                    onChange={this.handleChangeMode}
                >
                    {modes.map(el => (
                        <option key={el} value={el}>
                            {this.keyToReadebleFormat(el)}
                        </option>
                    ))}
                </select>
                <input
                    name="Name"
                    placeholder="Enter your name"
                    onChange={this.handleChange("name")}
                    value={name}
                />
                <button onClick={this.handlePlay}>Play</button>
                <div className={style.board}>
                    {board.map((square, index) => (
                        <Square
                            size={`${100 / boardSize}%`}
                            status={square.status}
                            // eslint-disable-next-line
                            key={index}
                        />
                    ))}
                </div>
            </>
        ) : (
            "empty"
        );
    };

    keyToReadebleFormat = key =>
        key.replace(/\.?([A-Z])/g, (_, y) => ` ${y.toLowerCase()}`);

    render() {
        // const { mode, settings } = this.state;

        return (
            <section className={style.game}>{this.generateGameBoard()}</section>
        );
    }
}

function getRandomInt(minimal, maximal) {
    const min = Math.ceil(minimal);
    const max = Math.floor(maximal);

    return Math.floor(Math.random() * (max - min)) + min;
}
