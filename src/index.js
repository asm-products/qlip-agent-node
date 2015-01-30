var clipboard = require('./clipboard'),
    prompt    = require('prompt'),
    station   = require('./station');

prompt.start();

prompt.get('access_token', function (err, result) {
    if (!err) {
        station.setup(result.access_token).then(function () {

            // Send local clipboard changes to iPaas server
            clipboard.on('change', function (content) {
                station.emit('clipboard', content);
            });

            // Listen for remote changes on clipboard and set them locally
            station.on('clipboard', function (content) {
                clipboard.set(content);
            });

        }, function (reason) {
            console.log(reason);
            throw new Error('Cannot setup station.');
        });
    } else {
        console.log('Error', err);
        throw new Error('Invalid access token.');
    }
});