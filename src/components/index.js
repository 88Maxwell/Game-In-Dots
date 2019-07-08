import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { settings, winners } from "../api";
import Leaderboard from "./Leaderboard";
import Game from "./Game";

export default class App extends Component {
    // static propTypes = {
    //     prop : PropTypes
    // }
    async componentDidMount() {
        console.log("qwrwetert");
        // const settingsList = await settings.list();
        // const winnersList = await winners.list();

        // console.log(settingsList);
        // console.log(winnersList);
    }

    render() {
        console.log("object");

        return (
            <div>
                <Leaderboard />
                <Game />
            </div>
        );
    }
}
