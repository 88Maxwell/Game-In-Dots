import React from "react";

import { settings as settingsApi, winners as winnersApi } from "../api";

import Game from './Game';
import Leaderboard from './Leaderboard';

import style from "./index.module.css";

export default class App extends React.Component {
    state = {
        winners: [],
        settings: []
    };

    // eslint-disable-next-line
    async UNSAFE_componentWillMount() {
        const settings = await settingsApi.list();
        const winners = await winnersApi.list();

        this.setState({ winners, settings });
    }

    render() {
        const { settings, winners } = this.state;

        return (
            <main className={style.main}>
                <Game settings={settings} />
                <Leaderboard winners={winners} />
            </main>
        );
    }
}
