const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: './public/static/img', to: 'img'},
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'index.[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: './src/index.html',
            filename: 'index.html'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.hbs$/,
                loader: "handlebars-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(svg|png|jpe?g|)$/,
                loader: "file-loader",
                options: {
                    name: '../img/[name].[ext]',
                },
            },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000
    },
};