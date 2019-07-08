/* eslint-disable import/no-commonjs */
const webpackMerge = require("webpack-merge");
const common = require("./webpack/common");

const envConfig = require(`./webpack/${process.env.MODE}.js`);

module.exports = webpackMerge(common, envConfig);
