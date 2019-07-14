import React from "react";
import PropTypes from "prop-types";
import style from "./square.module.css";

function Square({ status, size }) {
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

    return (<div style={inlineStyle} className={style.square} />);
}

Square.propTypes = {
    status : PropTypes.string,
    size   : PropTypes.string
};

export default Square;
