import React from "react";

import { winners as winnersApi } from "../api";
import Game from "./Game";
import Winnerboard from "./Winnerboard";

import style from "./index.module.css";

export class index extends React.Component {
    state ={ winners: [] }

    addWinner = async data => {
        const winners = await winnersApi.create(data);

        this.setState({ winners });
    };

    render() {
        const { winners }  = this.state;

        return (
            <main className={style.main}>
                <Game handleAddWinner={this.addWinner} />
                <Winnerboard winners={winners} />
            </main>
        );
    }
}

export default index;
