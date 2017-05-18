const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const entry = {
  app: './src/index.js',
  // vendor: ['react', 'react-dom']
}
// const plugins = [
//   new webpack.optimize.CommonsChunkPlugin({
//     names: ['app','vendor'],
//     minChunks: Infinity
//   })
  // ,
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: 'app',
  //   filename: 'app.js',
  //   minChunks: function () {
  //     console.log('chunks', module.context.indexOf('node_modules'), module.resource);
  //     return module.context && module.context.indexOf('node_modules') === -1;
  //   }
  // })
// ];

// Common rules
// const rules = [
//   {
//     test: /\.(js|jsx)$/,
//     exclude: /node_modules/,
//     use: [
//       'babel-loader',
//     ],
//   }
// ];


module.exports = {
  entry: entry,
  module: {
      rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      d3: 'd3/build/d3.node.js'
    }
  },
  output: {
    path: path.join(__dirname, '/docs'),
    publicPath: '/',
    filename: 'BarChart.js'
  },
  devServer: {
    contentBase: './docs',
    hot: true
  }
};

// dashboard
//     "start": "webpack-dashboard -- webpack-dev-server --devtool source-map --progress --colors --hot --config ./webpack.config.js ",