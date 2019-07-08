/* eslint-disable import/no-commonjs */
const path = require("path");

module.exports = {
    rootPath     : path.resolve(__dirname, "../../"),
    outputPath   : path.resolve(__dirname, "../../", "build"),
    entryPath    : path.resolve(__dirname, "../../", "src/index.js"),
    templatePath : path.resolve(__dirname, "../../", "src/index.html"),
    imagesFolder : "images",
    fontsFolder  : "fonts",
    cssFolder    : "css",
    jsFolder     : "js"
};
