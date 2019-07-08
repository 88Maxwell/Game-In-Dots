/* eslint-disable import/no-commonjs */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const {
    rootPath,
    outputPath,
    jsFolder,
    cssFolder
} = require("./utils/paths");
const { style } = require("./utils/rules");

module.exports = {
    mode : "production",

    devtool : "source-map",

    output : {
        filename      : `${jsFolder}/[name].[hash].js`,
        path          : outputPath,
        chunkFilename : "[name].[chunkhash].js"
    },

    module : { rules: [ style(MiniCssExtractPlugin) ] },

    plugins : [
        new CleanWebpackPlugin([ outputPath.split("/").pop() ], { root: rootPath }),
        new MiniCssExtractPlugin({
            filename      : `${cssFolder}/[name].css`,
            chunkFilename : "[id].css"
        })
    ]
};
