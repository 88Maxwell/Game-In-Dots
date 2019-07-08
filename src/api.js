import request from "./utils/request";

export const settings = {
    list : () => request.get("/game-settings")
};

export const winners = {
    list   : () => request.get("/winners"),
    create : data => request.post("/winners", data)
};

