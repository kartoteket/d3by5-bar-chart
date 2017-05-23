//
// Defines aliases and overrides
// for now these are the same for dev and prod
//
const aliases = {'d3': 'd3/build/d3.node.js',
                // 'lodash': 'lodash-es/lodash.js'
                };


module.exports = {
                    prod: aliases,
                    dev: aliases
                  };