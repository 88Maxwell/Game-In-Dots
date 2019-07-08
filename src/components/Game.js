import React, { Component } from "react";
// import PropTypes from "prop-types";

export default class Game extends Component {
    // static propTypes = {
    //     prop: PropTypes
    // };

    render() {
        return (
            <section>
                <h1>Main</h1>
                <select> Pick game mode</select>
                <input name="Name" placeholder="Enter your name" value="" />
                <button>Play</button>
            </section>
        );
    }
}
