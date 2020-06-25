import React, {
    useEffect, useCallback, useState, useMemo
} from "react";

import { settings } from "../configs";
import { getRandomInt, fromCamelcaseToText } from "../utils/helpers";
import Square from "./Square";

import style from "./game.module.css";


const PLAYERS = {
    USER     : "USER",
    COMPUTER : "COMPUTER"
};

const GAME_STATUS = {
    PENDING : "PENDING",
    ACTIVE  : "ACTIVE"
};

// eslint-disable-next-line max-len
const generateBoardMatrix = (countOfField) => Array.from(Array(countOfField)).map(() => ({ status: GAME_STATUS.PENDING }));
const modes = Object.keys(settings);

function Game() {
    const [ mode, setMode ] = useState(modes[0]);
    const boardSize = useMemo(() => settings[mode].field, [ mode ]);
    const [ board, setBoard ] = useState(generateBoardMatrix(boardSize ** 2));
    const [ isActive, setIsActive ] = useState(false);
    const [ isPlay, setIsPlay ] = useState(false);

    const pointOf = useCallback((who) => board.reduce((acc, elem) => (elem.status === who ? 1 + acc : acc), 0), [
        board
    ]);

    const getGameResult = useCallback(() => {
        const computerScore = pointOf(PLAYERS.COMPUTER, board);
        const userScore = pointOf(PLAYERS.USER, board);
        const halfOfPoins = Math.floor(boardSize ** 2 / 2);
        const is = {
            draw  : halfOfPoins === computerScore && halfOfPoins === userScore && halfOfPoins * 2 === boardSize,
            loose : halfOfPoins < computerScore,
            win   : halfOfPoins < userScore
        };

        if (is.draw) return { done: true, message: "Draw !" };
        if (is.loose) return { done: true, message: "You are loose!" };
        if (is.win) return { done: true, message: "You are win!" };

        return { done: false };
    }, [ board ]);

    useEffect(() => {
        const gameInteraval = setInterval(() => {
            if (isPlay) {
                const newBoard = [ ...board ];

                if (isActive) {
                    const { message, done } = getGameResult();

                    if (done) {
                        clearInterval(gameInteraval);
                        // eslint-disable-next-line
                        alert(message);
                        setIsPlay(false);
                        setBoard(generateBoardMatrix(boardSize ** 2));
                    } else {
                        const indexesOfPending = [];

                        // eslint-disable-next-line max-len
                        board.forEach((elem, index) => (elem.status === GAME_STATUS.PENDING ? indexesOfPending.push(index) : null));

                        const indexOfRandomPending = indexesOfPending[getRandomInt(0, indexesOfPending.length)];

                        newBoard[indexOfRandomPending].status = GAME_STATUS.ACTIVE;
                        setBoard(newBoard);
                        setIsActive(false);
                    }
                } else {
                    const indexOfActiveSquare = newBoard.findIndex((el) => el.status === GAME_STATUS.ACTIVE);

                    if (indexOfActiveSquare !== -1) {
                        newBoard[indexOfActiveSquare].status = PLAYERS.COMPUTER;
                        setBoard(newBoard);
                    }

                    setIsActive(true);
                }
            } else clearInterval(gameInteraval);
        }, settings[mode].delay);

        return () => clearInterval(gameInteraval);
    }, [ isPlay, isActive, board ]);

    const handlePlay = useCallback(() => setIsPlay(true), [ isPlay, setIsPlay ]);

    const handleClick = useCallback(
        (elemIndex) => () => {
            if (board[elemIndex].status === GAME_STATUS.ACTIVE) {
                const newBoard = [ ...board ];

                newBoard[elemIndex].status = PLAYERS.USER;
                setBoard(newBoard);
            }
        },
        [ board ]
    );

    const handleBreakGame = useCallback(() => {
        setIsPlay(false);
        setBoard(generateBoardMatrix(settings[mode].field ** 2));
    }, [ setIsPlay, setBoard, mode ]);

    const handleChangeMode = useCallback(
        ({ target: { value } }) => {
            setBoard(generateBoardMatrix(settings[value].field ** 2));
            setMode(value);
        },
        [ board, mode ]
    );

    return settings ? (
        <main className={style.game}>
            <header className={style.header}>
                <h1>Game In Dots</h1>
                <select
                    name="Mode"
                    aria-label="Game modes"
                    disabled={isPlay ? "disabled" : null}
                    value={mode || modes[0]}
                    onChange={handleChangeMode}
                >
                    {modes.map((el) => (
                        <option key={el} value={el}>
                            {fromCamelcaseToText(el)}
                        </option>
                    ))}
                </select>
                {!isPlay ? (
                    <button type="button" onClick={handlePlay}>
                        PLAY
                    </button>
                ) : (
                    <button type="button" onClick={handleBreakGame}>
                        Break game
                    </button>
                )}
            </header>
            <ul className={style.board}>
                {board?.length ? (
                    board.map((square, index) => (
                        <Square
                            size={`${100 / boardSize}%`}
                            status={square.status}
                            key={index.toString()}
                            handeClick={handleClick(index)}
                        />
                    ))
                ) : (
                    <li>Somethink happed 8(</li>
                )}
            </ul>
        </main>
    ) : null;
}

export default Game;
