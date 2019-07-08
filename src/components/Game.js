import React, { Component } from "react";
// import PropTypes from "prop-types";
import style from "./game.scss";

export default class Game extends Component {
    // static propTypes = {
    //     prop: PropTypes
    // };
    render() {
        console.log(style);

        return (
            <section>
                <h1>Main</h1>
                <select> Pick game mode</select>
                <input name="Name" placeholder="Enter your name" />
                <button>Play</button>
            </section>
        );
    }
}
