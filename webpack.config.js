const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: '/js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src/dist'),
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'OnMeet',
            template: '/index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.pug$/,
                use: ['pug-loader'],
            }
        ],
    }
};