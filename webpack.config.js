const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    entry: './src',
    plugins: [
        new HtmlWebpackPlugin({template: path.join('src/index.html')}),
        new webpack.ProvidePlugin({
            CANNON: 'cannon',
            BABYLON: '@babylonjs/core'
        })
    ]
};