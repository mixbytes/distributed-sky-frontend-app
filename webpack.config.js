const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        bundle: path.resolve(__dirname, 'src/index.js'),
    },
    resolve: {
        alias: {
            components: path.resolve(__dirname, 'src/components/'),
            consts: path.resolve(__dirname, 'src/consts/'),
            services: path.resolve(__dirname, 'src/services/'),
            utils: path.resolve(__dirname, 'src/utils/'),
            views: path.resolve(__dirname, 'src/views/'),
        },
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
            },
            {
                test: /\.hbs$/,
                use: 'handlebars-loader',
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
    ],
};