//
// Defienes the module portion of the config
//
const rules = require('./rules')
const modules = {
    prod: {
      rules: rules.prod
    },
    dev: {
      rules: rules.dev
    }
}

module.exports = modules;