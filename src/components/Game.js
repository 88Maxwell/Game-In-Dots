import React from "react";
import style from './game.module.css';

// import PropTypes from "prop-types";
export default class Game extends React.Component {
    // static propTypes = {
    //     prop: PropTypes
    // };
    render() {
        return (
            <section className={style.game}>
                <h1>Main</h1>
                <select> Pick game mode</select>
                <input name="Name" placeholder="Enter your name" />
                <button>Play</button>
            </section>
        );
    }
}
