const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPluginTemplate = path.join('src/index.html');
const contentBase = path.join(__dirname, 'dist');

module.exports = {
    mode: 'development',
    devServer: {
        contentBase,
        compress: true,
        port: 9000
    },
    devtool: 'source-map',
    entry: './src',
    module: {
        rules: [
            {
                test: /\.(dds|jpg|png)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: htmlWebpackPluginTemplate }),
        new webpack.ProvidePlugin({ CANNON: 'cannon', BABYLON: '@babylonjs/core'})
    ]
};