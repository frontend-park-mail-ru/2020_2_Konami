const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const config = {
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
            ],
        },
    }

    if (argv.mode === 'development') {
        console.log(argv.mode);
        config.devtool = 'eval-source-map';
        config.plugins.push(
            new webpack.LoaderOptionsPlugin({
                debug: true
            })
        )
    }

    return config
};
