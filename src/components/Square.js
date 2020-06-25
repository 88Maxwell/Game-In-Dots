import React from "react";
import PropTypes from "prop-types";
import style from "./square.module.css";

function Square({ status, size, handeClick }) {
    let backgroundColor;

    switch (status) {
        case "ACTIVE":
            backgroundColor = "blue";
            break;

        case "COMPUTER":
            backgroundColor = "red";
            break;

        case "USER":
            backgroundColor = "green";
            break;
        default:
            break;
    }

    const inlineStyle = {
        width  : size,
        height : size,
        backgroundColor
    };

    // eslint-disable-next-line
    return <li style={inlineStyle} className={style.square} onClick={handeClick} />; // TODO enable eslint for this line
}

Square.propTypes = {
    handeClick : PropTypes.func.isRequired,
    status     : PropTypes.string.isRequired,
    size       : PropTypes.string.isRequired
};

export default Square;
