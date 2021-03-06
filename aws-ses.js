var AWS = require("aws-sdk");
var Promise = require("bluebird");
var loopback = require('loopback');
var assert = require("assert");



module.exports = SESConnector;


var connection;
var settings;

function SESConnector(_settings) {

    assert(typeof _settings === 'object', 'cannot init connector without settings');

    settings = _settings;

    if (loopback.isServer) {
        return;
    }

    return getConnection();
}


function getConnection() {
    if(!connection) {
        connection = new AWS.SES({
            accessKeyId: settings.key,
            secretAccessKey: settings.secret,
            region: settings.region
        });
    }
    return connection;
}


SESConnector.prototype.DataAccessObject = Mailer;

function Mailer() {

}


Mailer.send = function (options, finalCb) {

    finalCb = finalCb || new Promise();

    assert(getConnection(), 'Cannot send mail without a connection!');

    if (!getConnection()) {
        console.warn('Warning: no connectiom with ses');
        return process.nextTick(function () {
            return finalCb(null, options);
        });
    }

    return connection.sendEmail(options, function(err, data) {
        if (err) return finalCb(err);

        return finalCb();
    });
};


Mailer.prototype.send = function (fn) {
    return this.constructor.send(this, fn);
};