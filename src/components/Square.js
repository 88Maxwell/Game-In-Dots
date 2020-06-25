import React from "react";
import PropTypes from "prop-types";
import style from "./square.module.css";

function Square({
    number, status, size, handeClick
}) {
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

    return (
        <li
            style={{
                width  : size,
                height : size
            }}
            className={style.listItem}
        >
            <button
                style={{ backgroundColor }}
                type="button"
                className={style.button}
                aria-label={`square-${number}`}
                onClick={handeClick}
            />
        </li>
    );
}

Square.propTypes = {
    handeClick : PropTypes.func.isRequired,
    status     : PropTypes.string.isRequired,
    number     : PropTypes.number.isRequired,
    size       : PropTypes.string.isRequired
};

export default Square;
