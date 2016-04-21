
var AWS = require("aws-sdk");
var Promise = require("bluebird");
var loopback = require('loopback');



module.exports = SESConnector;


var connection;
var settings;

function SESConnector(_settings) {

    assert(typeof settings === 'object', 'cannot init connector without settings');

    settings = _settings;

    if (loopback.isServer) {
        return;
    }

    getConnection();
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
        console.warn('Warning: no connectiom with Mandrill');
        return process.nextTick(function () {
            return finalCb(null, options);
        });
    }




        var template_name = options.template.name;
        var template_content = options.template.content || [];
        var message = {
            "subject": options.subject || "",
            "from_email": options.from.email,
            "from_name": options.from.name,
            "to": [{
                "email": options.to.email,
                "name": options.to.name,
                "type": "to"
            }]
        }

        // Are we sending vars with our template?
        if(Array.isArray(options.vars)) {
            message.merge = true;
            message.merge_language = "mailchimp";
            message.merge_vars = options.vars;
        }

        // Including any tags
        if(Array.isArray(options.tags)) {
            message.tags = options.tags
        }

        getConnection().messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message},
            function(result) {
                fn(null, result);
            }, function (err) {
                fn(err, null);
            });

    } else {
        console.warn('Warning: no connectiom with Mandrill');
        process.nextTick(function () {
            fn(null, options);
        });
    }
    return finalCb;
};

/**
 * Send an email instance using instance
 */

Mailer.prototype.send = function (fn) {
    return this.constructor.send(this, fn);
};


Mailer.subaccounts = function () {

    //var connector = this.dataSource.connector;

    return {
        list: function (query, cb) {

            var deferred = Q.defer();

            if (_.isFunction(query) && !cb) {
                cb = query;
            }

            getConnection().subaccounts.list({q: query}, function (result) {
                deferred.resolve(result);
                cb && cb(null, result);
            }, function (error) {
                deferred.resolve(error);
                cb && cb(error);
            });

            return deferred.promise;
        },

        add: function (subaccount, cb) {
            var //dataSource = this.dataSource,
            //connector = dataSource.connector,
                deferred = Q.defer();


            getConnection().subaccounts.add(subaccount, function (result) {
                deferred.resolve(result);
                cb && cb(null, result);
            }, function (error) {
                deferred.resolve(error);
                cb && cb(error);
            });

            return deferred.promise;
        },
        info: function (id, cb) {
            var //dataSource = this.dataSource,
            //connector = dataSource.connector,
                deferred = Q.defer();

            getConnection().mandrill.subaccounts.info({id: id}, function (result) {
                deferred.resolve(result);
                cb && cb(null, result);
            }, function (error) {
                deferred.resolve(error);
                cb && cb(error);
            });

            return deferred.promise;

        },
        update: function (subaccount, cb) {

            var //dataSource = this.dataSource,
            //connector = dataSource.connector,
                deferred = Q.defer();


            getConnection().mandrill.subaccounts.update(subaccount, function (result) {
                deferred.resolve(result);
                cb && cb(null, result);
            }, function (error) {
                deferred.resolve(error);
                cb && cb(error);
            });

            return deferred.promise;
        },
        delete: function (id, cb) {
            var //dataSource = this.dataSource,
            //connector = dataSource.connector,
                deferred = Q.defer();

            getConnection().subaccounts.delete({id: id}, function (result) {
                deferred.resolve(result);
                cb && cb(null, result);
            }, function (error) {
                deferred.resolve(error);
                cb && cb(error);
            });

            return deferred.promise;

        },
        pause: function (id, cb) {
            var //dataSource = this.dataSource,
            //connector = dataSource.connector,
                deferred = Q.defer();

            getConnection().subaccounts.pause({id: id}, function (result) {
                deferred.resolve(result);
                cb && cb(null, result);
            }, function (error) {
                deferred.resolve(error);
                cb && cb(error);
            });

            return deferred.promise;

        },
        resume: function (id, cb) {
            var //dataSource = this.dataSource,
            //connector = dataSource.connector,
                deferred = Q.defer();

            getConnection().subaccounts.resume({id: id}, function (result) {
                deferred.resolve(result);
                cb && cb(null, result);
            }, function (error) {
                deferred.resolve(error);
                cb && cb(error);
            });

            return deferred.promise;
        }
    }
};
