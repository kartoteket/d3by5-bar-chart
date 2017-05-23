const BundleAnalyzer  = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const resolve = require('../config/resolve');
const entries = require('../config/entries');
const outputs = require('../config/output');
const modules = require('../config/module');
const plugins = require('../config/plugins').dev;
const bundlePlugin = new BundleAnalyzer();

plugins.push(bundlePlugin);

module.exports = {
    context: __dirname,
    module: modules.dev,
    entry:  entries.dev,
    output: outputs.dev,
    resolve: resolve.dev,
    plugins: plugins,
}