const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let config = {
    // devtool: 'source-map',
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
                test: /\.(css|s[ac]ss)$/,
                use: [
                    'css-loader?url=false',
                    'sass-loader',
                ]
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
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            template: './src/index.html',
            filename: 'index.html'
        }),
    ],

    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8008',
                pathRewrite: {'^/api': ''},
            },
        }
    },
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.module.rules[2].use.unshift('style-loader');
    } else {
        config.module.rules[2].use.unshift(MiniCssExtractPlugin.loader);
    }
    return config
};