import React from "react";

import Game from "./Game";
import Leaderboard from "./Leaderboard";

import style from "./index.module.css";

export default () => {
    return (
        <main className={style.main}>
            <Game />
            <Leaderboard />
        </main>
    );
};
