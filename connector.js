/**
 * Dependencies
 */

var Mandrill = require('mandrill-api/mandrill'),

var  loopback = require('loopback');

/**
 * Export the connector class
 */

module.exports = MandrillConnector;



function MandrillConnector(options) {

    assert(typeof options === 'object', 'cannot init connector without settings');

    if (loopback.isServer) {
        connection = new Mandrill.Mandrill(settings.apiKey);
    }
}



MandrillConnector.prototype.DataAccessObject = Mailer;

function Mailer() {

}



Mailer.send = function (options, cb) {

};

/**
 * Send an email instance using instance
 */

Mailer.prototype.send = function (fn) {
    return this.constructor.send(this, fn);
};

