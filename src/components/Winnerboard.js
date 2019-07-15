import React, { Component } from "react";
import PropTypes from "prop-types";
import { winners as winnersApi } from "../api";

import style from "./winnerboard.module.css";

export default class Winnerboard extends Component {
    static propTypes = {
        winners : PropTypes.array.isRequired
    }

    state = {
        winners   : [],
        isLoading : true,
        error     : ""
    }


    async componentDidMount() {
        this.setState({ isLoading: true });
        const winners = await winnersApi.list();

        if (!winners) {
            return this.setState({ error: "connection error" });
        }
        this.setState({ winners, isLoading: false });
    }

    static getDerivedStateFromProps(props) {
        if (props.winners.length) {
            return { winners: props.winners };
        }

        return null;
    }

    render() {
        const { isLoading, error, winners } = this.state;

        if (isLoading) {
            return (
                <section className={style.game}>
                    <p>isLoading ...</p>;
                </section>
            );
        }

        if (error) {
            return (
                <section className={style.game}>
                    <p>{error}</p>
                </section>
            );
        }

        return (
            <section className={style.winnerboard}>
                <h1>Winner Board</h1>
                <ul className={style.winnerList} >
                    {Array.isArray(winners) && winners.length ? (
                        winners.map(winner => (
                            <li key={winner.id} className={style.winnerItem}>
                                <div className={style.record}>{winner.winner}</div>
                                <div className={style.record}>{winner.date}</div>
                            </li>
                        ))
                    ) : (
                        <li className={style.leaderItem}>Empty list</li>
                    )}
                </ul>
            </section>
        );
    }
}

