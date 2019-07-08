/* eslint-disable import/no-commonjs */
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

const { entryPath, templatePath } = require("./utils/paths");
const { eslint, js, images, fonts, style } = require("./utils/rules");

module.exports = {
    entry   : entryPath,
    module  : { rules: [ style(), eslint(), js(), images(), fonts() ] },
    resolve : {
        modules    : [ "src", "node_modules" ],
        extensions : [ "*", ".js", ".jsx", ".css", ".scss", ".sass" ]
    },
    plugins : [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({ template: templatePath }),
        new ScriptExtHtmlWebpackPlugin({ defaultAttribute: "async" })
    ]
};
