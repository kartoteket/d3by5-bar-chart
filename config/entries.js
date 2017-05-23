//
// A list of entries that are to be included in the build
//
const entries = {
        app: '../src/index.js',
        main: '../docs/scss/main.scss',
        vendor: ['lodash', 'd3']
      };
module.exports = {
  prod: entries,
  dev: entries
};