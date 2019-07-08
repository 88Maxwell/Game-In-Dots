import React from "react";
// import PropTypes from "prop-types";

function Leaderboard() {
    return (
        <section className="leaderboard">
            <h1>Leader Board</h1>
            <ul>
                <li>
                    <div>User Name</div>
                    <div>Date and Time</div>
                </li>
            </ul>
        </section>
    );
}

Leaderboard.propTypes = {};

export default Leaderboard;
