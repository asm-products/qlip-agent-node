var config     = require('./config'),
    io         = require('socket.io-client'),
    Q          = require('q')
    ;

function Station() {
    this.listeners = {};
}

Station.prototype.setup = function (access_token) {
    var me = this,
        deferred  = Q.defer(),
        socket = io.connect(config.station, { query: "access_token=" + access_token });

    me.socket = socket;
    me.room = null;

    socket.on('connect', function() {
        console.log('Qlip agent is connected to station at %s', config.station);
        deferred.resolve();
    });

    socket.on('error', function(reason) {
        console.log('Error on station %s', config.station);
        deferred.reject(reason);
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from station %s', config.station);
        deferred.reject('disconnect');
    });

    socket.on('clipboard', function(content) {
        me.trigger('clipboard', content);
    });

    return deferred.promise;
};

Station.prototype.emit = function (event, content) {
    console.log('[Station] emit', event, content);
    this.socket.emit(event, content);
};

Station.prototype.on = function (event, callback) {
    if (typeof this.listeners[event] === 'undefined') {
        this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
};

Station.prototype.trigger = function (event, content) {
    if (typeof this.listeners[event] !== 'undefined') {
        for (var i in this.listeners[event]) {
            if (this.listeners[event].hasOwnProperty(i)) {
                this.listeners[event][i].apply(this, [content]);
            }
        }
    }
};

module.exports = new Station();