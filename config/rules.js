//
// Defines the rules for a build
//
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const js = {
              test: /\.js?$/,
              exclude: /node_modules/,
              // use: ['babel-loader','lodash']
              use: ['babel-loader']
            };

const css = { // sass / scss loader for webpack
              test: /\.(sass|scss)$/,
              use: ExtractTextPlugin.extract({
                use: ['css-loader', 'sass-loader']
              })
            }


const rules = {
  prod: [js, css],
  dev: [js, css]
}