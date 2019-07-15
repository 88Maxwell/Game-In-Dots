export const getRandomInt = (minimal, maximal) => {
    const min = Math.ceil(minimal);
    const max = Math.floor(maximal);

    return Math.floor(Math.random() * (max - min)) + min;
};

export const formatDate = date => {
    // 21:51; 14 July 2019
    date.getDate();
    const fullYear = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes}; ${day} ${month} ${fullYear}`;
};


export const fromCamelcaseToText = key =>
    key.replace(/\.?([A-Z])/g, (_, y) => ` ${y.toLowerCase()}`);
