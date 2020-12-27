const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    devtool: 'source-map',
    entry: {
        main: './src/index.js',
        sw: './src/sw.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
    },

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
                test:/\.s[ac]ss$/,
                use: ['style-loader', 'css-loader?url=false', 'sass-loader',]
            },
            {
                test:/\.(css|s[ac]ss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader?url=false', 'sass-loader',]
            },
            {
                test: /\.(svg|png|jpe?g|)$/,
                loader: "file-loader",
                options: {
                    name: '../img/[name].[ext]',
                },
            },
            {
                test: /\.(ttf|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    name: '../fonts/[name].[ext]',
                },
            },
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {from: './public/static/img', to: 'img'},
                {from: './public/static/fonts', to: 'fonts'},
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: './src/index.html',
            filename: 'index.html'
        }),
        require('autoprefixer')
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: true,
            }),
            new CssMinimizerPlugin({
                parallel: true,
            }),
        ],
    },

    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8008',
                // pathRewrite: {'^/api': ''},
            },
        }
    },
};