/* eslint-disable import/no-commonjs */
const webpack = require("webpack");

const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const { outputPath } = require("./utils/paths");
const { style } = require("./utils/rules");

module.exports = {
    mode : "development",

    output : {
        filename      : "[name].js",
        path          : outputPath,
        chunkFilename : "[name].js"
    },

    module    : { rules: [ style() ] },
    devServer : {
        host        : "0.0.0.0",
        port        : 3000,
        contentBase : outputPath,
        stats       : "minimal",
        // compress    : true,
        hot         : true,
        open        : true
    },

    plugins : [
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsWebpackPlugin({ clearConsole: true })
    ]
};
