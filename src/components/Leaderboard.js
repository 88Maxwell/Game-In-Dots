import React from "react";
// import PropTypes from "prop-types";
import style from "./leaderboard.module.css";

function Leaderboard({ winners: leaders }) {
    console.log(leaders);
    return (
        <section className={style.leaderboard}>
            <h1>Leader Board</h1>
            <ul className={style.leaderList} />
            {generateLeaderList(leaders)}
        </section>
    );
}

const generateLeaderList = leaders =>
    Array.isArray(leaders) && leaders.length ? (
        leaders.map(leader => (
            <li key={leader.id} className={style.leaderItem}>
                <div>{leader.winner}</div>
                <div>{leader.date}</div>
            </li>
        ))
    ) : (
        <li className={style.leaderItem}>Empty list</li>
    );

// Leaderboard.propTypes = {};

export default Leaderboard;
