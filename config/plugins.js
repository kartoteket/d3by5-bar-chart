//
// Defines the pugins that are used for the build
//
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// create plugins
const plugins = {
    dev: [],
    prod: []
}


// lodash
const lodash = new LodashModuleReplacementPlugin();
plugins.dev.push(lodash);
plugins.prod.push(lodash);


// vendor chunk
const vendorChunk = new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        console.log('app resource', module.context)
        return module.context && module.context.indexOf('/node_modules/') !== -1
        if (count > 1) {
            console.log('BIG COUNT = ', count);
        }
      }
    });
plugins.dev.push(vendorChunk);
plugins.prod.push(vendorChunk);


// parse the app
const appChunk = new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      minChunks: function (module, count) {
        console.log('app resource', module.context)
        return module.context && module.context.indexOf('/node_modules/') < -1
      }
    });
plugins.dev.push(appChunk);
plugins.prod.push(appChunk)


// ulification
const uglifyPlugin = new UglifyJSPlugin()
plugins.dev.push(uglifyPlugin);
plugins.prod.push(uglifyPlugin);


// css parsing
const css = new ExtractTextPlugin({ // define where to save the file
      filename: 'css/[name].css',
      allChunks: true,
    });
plugins.dev.push(css);
plugins.prod.push(css);

// export it
module.exports = plugins;
