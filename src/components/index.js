import React, { Component } from "react";
// import PropTypes from "prop-types";
import { settings as settingsApi, winners as winnersApi } from "../api";
import Leaderboard from "./Leaderboard";
import Game from "./Game";

export default class App extends Component {
    // static propTypes = {
    //     prop : PropTypes
    // }
    state = {
        winners  : [],
        settings : []
    }

    // eslint-disable-next-line
    async UNSAFE_componentWillMount() {
        const settings = await settingsApi.list();
        const winners = await winnersApi.list();

        this.setState({ winners, settings });
    }

    render() {
        console.log(this.state);
        const { settings, winners } = this.state;


        return (
            <div>
                <Leaderboard winners={winners} />
                <Game settings={settings} />
            </div>
        );
    }
}
