var _ = require('lodash');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

function Config(config) {
    // Default configurations
    this.set(_.extend({

        // Add default configurations here

    }, config));
}

Config.prototype.set = function (config) {
    if (_.isObject(config[process.env.NODE_ENV])) {
        _.extend(this, config[process.env.NODE_ENV]);
    } else {
        _.extend(this, config);
    }
};

module.exports = new Config();

// Load settings into configuration object
try {
    module.exports.set(require('../settings') || {});
} catch(e) {
    console.error('Could not locate settings.js');
}