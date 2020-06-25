export const getRandomInt = (minimal, maximal) => {
    const min = Math.ceil(minimal);
    const max = Math.floor(maximal);

    return Math.floor(Math.random() * (max - min)) + min;
};

export const fromCamelcaseToText = key => key.replace(/\.?([A-Z])/g, (_, y) => ` ${y.toLowerCase()}`);
