const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
    ],
    module: {
        rules: [
           {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 
                    'sass-loader',
                ],
            },
            {
                test: /\.pug$/,
                use: ['pug-loader'],
            },
            {
                test: /\.js$/,
                loader: 'buble-loader',
                include: path.join(__dirname, 'src'),
                options: {
                    objectAssign: 'Object.assign',
                    transforms: {
                        modules: false,
                        dangerousForOf: true,
                        asyncAwait: false,
                    },
                },
            },
        ],
    }
};
