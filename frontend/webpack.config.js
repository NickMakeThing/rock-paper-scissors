
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleTracker = require('webpack-bundle-tracker')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    // Where Webpack looks to load JavaScript
    entry: {
        main: path.resolve(__dirname, 'src/index.js'),
    },
    mode: 'development',
    // Where Webpack spits out the results
    output: {
        path: path.resolve(__dirname, '../backend/rockpaperscissors/static/build/'),
        filename: '[name].js',
    },
    module: {
        rules:[
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] //MiniCssExtractPlugin.loader
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{ 
                    loader: 'babel-loader',
                    options: {
                        plugins:['react-refresh/babel']
                    }
                }],   
            }
        ]
    },
    // Config (eg. don't create new files if there is an error)
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ReactRefreshWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),        
        new BundleTracker({
            path: path.resolve(__dirname,'../backend/'),
            filename: 'webpack-stats.json'
        })
    ],
    // Where find modules that can be imported (eg. React) 
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
        ],
    },
}

