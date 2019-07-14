import React, { Component } from "react";
import { winners as winnersApi } from "../api";

import style from "./leaderboard.module.css";

export default class Leaderboard extends Component {
    state = {
        isLoading : false,
        winners   : []
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        const winners = await winnersApi.list();

        if (!winners) {
            return this.setState({ error: "connection error" });
        }

        this.setState({ winners, isLoading: false });
    }

    generateWinerList = () => {
        const { winners } = this.state;

        return Array.isArray(winners) && winners.length ? (
            winners.map(winner => (
                <li key={winner.id} className={style.winnerItem}>
                    <div>{winner.winner}</div>
                    <div>{winner.date}</div>
                </li>
            ))
        ) : (
            <li className={style.leaderItem}>Empty list</li>
        );
    }


    render() {
        return (
            <section className={style.leaderboard}>
                <h1>Leader Board</h1>
                <ul className={style.leaderList} >
                    {this.generateWinerList()}
                </ul>
            </section>
        );
    }
}
