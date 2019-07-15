import React from "react";
import PropTypes from "prop-types";
import { settings as settingsApi } from "../api";
import { getRandomInt, formatDate, fromCamelcaseToText } from "../utils/helpers";
import Square from "./Square";

import style from "./game.module.css";

export default class Game extends React.Component {
    static propTypes = {
        handleAddWinner : PropTypes.func.isRequired
    }

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
        const { mode, settings } = this.state;

        this.setState({
            isPlay : false,
            board  : this.generateBoardMatrix(settings[mode].field ** 2)
        });
    }

    handlePlay = () => {
        const { mode, settings } = this.state;

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
        const { settings, mode, name,  board } = this.state;
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
        const { settings, mode } = this.state;
        const { handleAddWinner } = this.props;

        clearInterval(gameInteraval);
        await handleAddWinner({ winner, date: formatDate(new Date()) });
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
            settings,
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
            <section className={style.game}>
                <div>
                    <h1>Game In Dots</h1>
                    <select
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
                        {board.map((square, index) => (
                            <Square
                                size={`${100 / boardSize}%`}
                                status={square.status}
                                // eslint-disable-next-line
                        key={index}
                                handeClick={this.handleClick(index)}
                            />
                        ))}
                    </ul>
                </div>

            </section>
        ) : null;
    }
}
