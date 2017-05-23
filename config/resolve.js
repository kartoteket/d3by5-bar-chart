const aliases = require('./aliases');
const extensions = ['.js'];

const resolve = {
    dev: {
        extensions: extensions,
        alias: aliases.dev
    },
    prod: {
        extensions: extensions,
        alias: aliases.prod
    }
};

module.exports = resolve;