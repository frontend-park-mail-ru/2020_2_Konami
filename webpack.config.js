const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: '/js/main.js',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src'),
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'OnMeet',
            template: '/html/index.html',
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
