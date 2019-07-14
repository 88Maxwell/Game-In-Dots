import React from "react";
import { settings as settingsApi } from "../api";
import Square from "./Square";

import style from "./game.module.css";

export default class Game extends React.Component {
    state = {
        error     : "",
        isLoading : true,
        settings  : {},
        mode      : "",
        name      : "",
        isPlay    : false
    };

    async componentDidMount() {
        // this.setState({ isLoading: true });
        const settings = await settingsApi.list();

        if (!settings) {
            return this.setState({ error: "connection error" });
        }
        const firstModeKey = Object.keys(settings)[0];

        console.log(firstModeKey);
        this.setState({ settings, mode: firstModeKey, isLoading: false });
    }

    handleChange = param => evt => this.setState({ [param]: evt.target.value });

    handlePlay =  () => {
        console.log("PLAY");
    };

    generateGameBoard = () => {
        const { isLoading, mode, name, settings, error } = this.state;

        if (isLoading) {
            return <p>isLoading ...</p>;
        }

        if (error) {
            return <p>{error}</p>;
        }
        const modes = settings && Object.keys(settings);

        console.log(mode);
        const board = [];
        const boardSize = settings[mode].field;

        // eslint-disable-next-line more/no-c-like-loops
        for (let i = 0; i < boardSize ** 2; i++) {
            board.push(<Square size={`${100 / boardSize}%`} key={i} />);
        }


        return settings ? (
            <>
                <h1>Game</h1>
                <select
                    value={mode ? mode : modes[0]}
                    onChange={this.handleChange("mode")}
                >
                    {modes.map(el => (
                        <option key={el} value={el}>
                            {this.keyToReadebleFormat(el)}
                        </option>)
                    )}
                </select>
                <input
                    name="Name"
                    placeholder="Enter your name"
                    onChange={this.handleChange("name")}
                    value={name}
                />
                <button onClick={this.handlePlay()}>Play</button>
                <div className={style.board}>
                    {board}
                </div>

            </>
        ) : "empty";
    };

    keyToReadebleFormat = key => key.replace(/\.?([A-Z])/g, (_, y) => ` ${y.toLowerCase()}`);

    render() {
        // const { mode, settings } = this.state;

        return (
            <section className={style.game}>
                {this.generateGameBoard()}
            </section>
        );
    }
}
