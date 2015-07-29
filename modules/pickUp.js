/**
 * Created by Dion on 29/07/2015.
 */
var reddit = require('./common/reddit.js'),
    require_install = require('require-install'),
    request = require_install('request'),
    results = [];

exports.match = function(text) {
    return text.startsWith(this.platform.commandPrefix + 'pickup');
};

exports.help = function() {
    return this.platform.commandPrefix + 'pickup : Relationship advice.';
};

exports.joke = function(callback) {
    // If we have no stored joke, get some
    if (typeof results === 'undefined' || results === null || results.length === 0) {

        reddit.reddit('pickuplines', 200, function (err, data) {
            if (!err) {
                results = data;
                exports.fuckNode(callback);
            }
            else {
                callback(data);
            }
        });
    }
    else {
        exports.fuckNode(callback);
    }
};

exports.fuckNode = function(callback) {
    // Get some random joke

    var index = Math.floor(Math.random() * results.length),
        title = results[index].data.title,
        text = results[index].data.selftext;

    // Delete the joke, so we don't get it again
    results.splice(index, 1);

    callback(title + '\n' + text);
};

exports.run = function(api, event) {
    exports.joke(function(result) {
        api.sendMessage(result, event.thread_id);
    });
};
