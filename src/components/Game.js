import React from "react";

import { settings } from "../../configs";
import { getRandomInt, fromCamelcaseToText } from "../utils/helpers";

import Square from "./Square";

import style from "./game.module.css";

export default class Game extends React.Component {
    state = {
        error      : "",
        isLoading  : true,
        settings   : {},
        mode       : "",
        name       : "",
        board      : [],
        isPlay     : false,
        winMessage : ""
    };

    async componentDidMount() {
        const firstModeKey = Object.keys(settings)[0];

        this.setState({
            settings,
            mode      : firstModeKey,
            board     : this.generateBoardMatrix(settings[firstModeKey].field ** 2),
            isLoading : false
        });
    }

    handleChangeMode = ({ target: { value } }) => this.setState({
        board : this.generateBoardMatrix(this.state.settings[value].field ** 2),
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

    handleBreakGame = () => {
        const { mode } = this.state;

        this.setState({
            isPlay : false,
            board  : this.generateBoardMatrix(settings[mode].field ** 2)
        });
    }

    handlePlay = () => {
        const { mode } = this.state;

        let isActive = true;

        this.setState({ isPlay: true }, () => {
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
                        const indexOfRandomPending =
                        indexesOfPending[getRandomInt(0, indexesOfPending.length)];

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
            }, settings[mode].delay);
        });
    };


    checkWinners =  async gameInteraval => {
        const { mode, name,  board } = this.state;
        const computerScore = this.pointOf("COMPUTER", board);
        const userScore = this.pointOf("USER", board);
        const halfOfPoins = Math.floor(settings[mode].field ** 2 / 2);

        if (halfOfPoins < computerScore) {
            await this.endGame("computer", gameInteraval);
        }
        if (halfOfPoins < userScore) {
            await this.endGame(name, gameInteraval);
        }
    };

    async endGame(winner, gameInteraval) {
        const { mode } = this.state;

        clearInterval(gameInteraval);
        this.setState({
            winMessage : `${winner} is win!`,
            isPlay     : false,
            board      : this.generateBoardMatrix(settings[mode].field ** 2)
        });
    }

    pointOf = (who, board) =>
        board.reduce((accumalator, elem) => elem.status === who ? 1 + accumalator : accumalator, 0);

    generateBoardMatrix = countOfField =>
        Array.from(Array(countOfField)).map(() => ({ status: "PENDING" }));

    render() {
        const {
            isLoading,
            isPlay,
            mode,
            name,
            board,
            error,
            winMessage
        } = this.state;


        if (isLoading) {
            return (
                <section className={style.game}>
                    <p>isLoading ...</p>;
                </section>
            );
        }

        if (error) {
            return (
                <section className={style.game}>
                    <p>{error}</p>
                </section>
            );
        }
        const modes = settings && Object.keys(settings);
        const boardSize = settings[mode].field;
        const isDisabled = isPlay ? "disabled" : "";

        return settings ? (
            <main className={style.main}>
                <section className={style.game}>
                    <div>
                        <h1>Game In Dots</h1>
                        <select
                            name="Mode"
                            aria-label="Game modes"
                            disabled={isDisabled}
                            value={mode ? mode : modes[0]}
                            onChange={this.handleChangeMode}
                        >
                            {modes.map(el => (
                                <option key={el} value={el}>
                                    {fromCamelcaseToText(el)}
                                </option>
                            ))}
                        </select>
                        <input
                            name="Name"
                            aria-label="Name of user"
                            required
                            disabled={isDisabled}
                            placeholder="Enter your name"
                            onChange={this.handleChange("name")}
                            value={name}
                        />
                        {
                            !isPlay
                                ? <button disabled={!name} onClick={this.handlePlay}>{winMessage ? "PLAY AGAIN" : "PLAY" }</button>
                                : <button onClick={this.handleBreakGame}>Break game</button>
                        }

                    </div>
                    <div>
                        {!isPlay && winMessage
                            ? <div className={style.winMessage}>{winMessage}</div>
                            : null
                        }
                        <ul className={style.board}>
                            {board && board.length ? board.map((square, index) => (
                                <Square
                                    size={`${100 / boardSize}%`}
                                    status={square.status}
                                    // eslint-disable-next-line
                                key={index}
                                    handeClick={this.handleClick(index)}
                                />
                            )) : <li>Somethink happed 8(</li>}
                        </ul>
                    </div>

                </section>
            </main>
        ) : null;
    }
}
