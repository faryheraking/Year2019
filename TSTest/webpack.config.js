const path = require('path');
const webpack = require('webpack');
const HtmlWebpack = require('html-webpack-plugin');
module.exports = {
    entry: {
        index: "./src/index.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',

    // Add the loader for .ts files.
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpack({
            title:"TypeScript"
        })
        //new CheckerPlugin()
    ]
};