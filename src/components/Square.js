import React from "react";
import PropTypes from "prop-types";
import style from "./square.module.css";

function Square({ status, size }) {
    const inlineStyle = {
        width  : size,
        height : size
    };

    if (status) {
        inlineStyle.backgroundColor = status === "computer" ? "red" : "green";
    }

    return (<div style={{ ...inlineStyle }} className={style.square} />);
}

Square.propTypes = {
    status : PropTypes.string,
    size   : PropTypes.string
};

export default Square;
