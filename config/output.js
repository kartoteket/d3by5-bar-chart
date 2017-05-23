//
//Defines the outputs
//
const path = require('path');
const output = {
    path: path.join(__dirname, '/docs'),
    publicPath: '/',
    filename: 'js/[name].js'
}
module.exports = {
    prod: output,
    dev: output,
}