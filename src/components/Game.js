import React from "react";

import { settings } from "../../configs";
import { getRandomInt, fromCamelcaseToText } from "../utils/helpers";

import Square from "./Square";

import style from "./game.module.css";

export default class Game extends React.Component {
    constructor() {
        super();
        const firstModeKey = Object.keys(settings)[0];

        this.state = {
            mode   : firstModeKey,
            board  : this.generateBoardMatrix(settings[firstModeKey].field ** 2),
            isPlay : false
        };
    }

    handleChangeMode = ({ target: { value } }) =>
        this.setState({
            board : this.generateBoardMatrix(settings[value].field ** 2),
            mode  : value
        });

    handleChange = param => evt => this.setState({ [param]: evt.target.value });

    handleClick = elemIndex => () => {
        const { board } = this.state;
        const newBoard = [ ...board ];

        if (newBoard[elemIndex].status === "ACTIVE") {
            newBoard[elemIndex].status = "USER";
            this.setState({ board: newBoard });
        }
    };

    handleBreakGame = () =>
        this.setState({
            isPlay : false,
            board  : this.generateBoardMatrix(settings[this.state.mode].field ** 2)
        });

    handlePlay = () =>
        this.setState({ isPlay: true }, () => {
            let isActive = true;

            const gameInteraval = setInterval(async () => {
                const { isPlay, board } = this.state;

                if (isPlay) {
                    const newBoard = [ ...board ];

                    if (isActive) {
                        const indexesOfPending = [];

                        board.forEach((elem, index) => {
                            if (elem.status === "PENDING") {
                                indexesOfPending.push(index);
                            }
                        });
                        const indexOfRandomPending = indexesOfPending[getRandomInt(0, indexesOfPending.length)];

                        newBoard[indexOfRandomPending].status = "ACTIVE";
                        this.setState({ board: newBoard });
                        isActive = false;
                    } else {
                        const indexOfActiveSquare = newBoard.findIndex(el => el.status === "ACTIVE");

                        if (indexOfActiveSquare !== -1) {
                            newBoard[indexOfActiveSquare].status = "COMPUTER";
                            this.setState({ board: newBoard });
                        }
                        await this.checkWinners(gameInteraval);

                        isActive = true;
                    }
                } else {
                    clearInterval(gameInteraval);
                }
            }, settings[this.state.mode].delay);
        });

    checkWinners = async gameInteraval => {
        const { mode, board } = this.state;
        const computerScore = this.pointOf("COMPUTER", board);
        const userScore = this.pointOf("USER", board);
        const boardSize = settings[mode].field ** 2;
        const halfOfPoins = Math.floor(boardSize / 2);
        const is = {
            draw  : halfOfPoins === computerScore && halfOfPoins === userScore && halfOfPoins * 2 === boardSize,
            loose : halfOfPoins < computerScore,
            win   : halfOfPoins < userScore
        };

        let finalMessage = "";

        if (is.draw || is.loose || is.win) {
            if (is.draw) {
                finalMessage = "Draw !";
            }
            if (is.loose) {
                finalMessage = "You are loose!";
            }
            if (is.win) {
                finalMessage = "You are win!";
            }
            clearInterval(gameInteraval);

            // eslint-disable-next-line
            alert(finalMessage);

            this.setState({
                isPlay : false,
                board  : this.generateBoardMatrix(boardSize)
            });
        }
    };

    pointOf = (who, board) =>
        board.reduce((accumalator, elem) => (elem.status === who ? 1 + accumalator : accumalator), 0);

    generateBoardMatrix = countOfField => Array.from(Array(countOfField)).map(() => ({ status: "PENDING" }));

    render() {
        const { isPlay, mode, board } = this.state;

        const modes = Object.keys(settings);
        const boardSize = settings[mode].field;

        return settings ? (
            <main className={style.game}>
                <header  className={style.header}>
                    <h1>Game In Dots</h1>
                    <select
                        name="Mode"
                        aria-label="Game modes"
                        disabled={isPlay ? "disabled" : ""}
                        value={mode ? mode : modes[0]}
                        onChange={this.handleChangeMode}
                    >
                        {modes.map(el => (
                            <option key={el} value={el}>
                                {fromCamelcaseToText(el)}
                            </option>
                        ))}
                    </select>
                    {!isPlay ? (
                        <button onClick={this.handlePlay}>PLAY</button>
                    ) : (
                        <button onClick={this.handleBreakGame}>Break game</button>
                    )}
                </header>
                <ul className={style.board}>
                    {board && board.length ? (
                        board.map((square, index) => (
                            <Square
                                size={`${100 / boardSize}%`}
                                status={square.status}
                                // eslint-disable-next-line
                                        key={index}
                                handeClick={this.handleClick(index)}
                            />
                        ))
                    ) : (
                        <li>Somethink happed 8(</li>
                    )}
                </ul>
            </main>
        ) : null;
    }
}
