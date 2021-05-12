const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        bundle: path.resolve(__dirname, 'src/index.js'),
    },
    resolve: {
        alias: {
            components: path.resolve(__dirname, 'src/components/'),
            consts: path.resolve(__dirname, 'src/consts/'),
            controllers: path.resolve(__dirname, 'src/controllers'),
            services: path.resolve(__dirname, 'src/services/'),
            utils: path.resolve(__dirname, 'src/utils/'),
            views: path.resolve(__dirname, 'src/views/'),

            'index.scss': path.resolve(__dirname, 'public/css/index.scss'),
        },
        extensions: ['.js'],
        fallback: {
            'crypto': require.resolve('crypto-browserify'),
            'stream': require.resolve('stream-browserify'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
            },
            {
                test: /\.s[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.hbs$/,
                use: 'handlebars-loader',
            },
            {
                // IMAGE LOADER
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader:'file-loader'
            },
            {
                // HTML LOADER
                test: /\.html$/,
                loader: 'html-loader'
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        publicPath:'/static/',
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            template: path.resolve(__dirname, 'public/index.html'),
            filename: 'index.html',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser.js',
        }),
    ],
};