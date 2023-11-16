const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    cache: false,
    mode: "production",
    entry: {
        index: './src/js/index.js',
        chatPage: "./src/js/websocketConnectionManager.js"
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [

        new MiniCssExtractPlugin(),

        new HtmlWebpackPlugin({
            template: "./pages/index.html",
            chunks: ["index"],
            filename: "index.html"
        }),

        new HtmlWebpackPlugin({
            template: "./pages/chatPage.html",
            chunks: ["chatPage"],
            filename: "chatPage.html"
        }),

    ],
    module: {

        rules: [

            {

                test: /\.css$/i,

                use: [MiniCssExtractPlugin.loader, 'css-loader'],

            },

        ],

    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            "..."
        ],
    },

};