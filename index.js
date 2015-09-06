/**
 * Created by zhaokai on 8/26/15.
 */
"use strict";

var _ = require('lodash-fp');
var Promise = require('bluebird/js/main/promise')();

Promise.prototype.timeTracker = function (func, label) {
    if (typeof func !== 'function') {
        throw new Error("The given func is not a function.");
    }
    return this.timeStart(label).then(func).timeEnd(label);
};

Promise.prototype.timeStart = function (label) {
    return this.then(function () {
        console.log('----------------------------------' + label + '----------------------------------');
        console.time(label);
    });
};

Promise.prototype.timeEnd = function (label) {
    return this.then(function () {
        console.timeEnd(label);
        console.log('----------------------------------' + label + '----------------------------------');
    });
};

Promise.prototype.rows = function () {
    return this.get(0);
};

Promise.prototype.thenRows = function (func) {
    return this.rows().then(func);
};

Promise.prototype.firstObject = function () {
    return this.rows().get(0);
};

Promise.prototype.thenFirstObject = function (func) {
    return this.rows().get(0).then(func);
};

Promise.prototype.flatten = function (isDeep) {
    if (isDeep === true) {
        return this.then(_.flattenDeep);
    } else {
        return this.then(_.flatten);
    }
};

Promise.prototype.flattenDeep = function () {
    return this.flatten(true);
};

Promise.prototype.number = function () {
    return this.then(function (v) {
        return v ? Number(v) : 0;
    });
};

Promise.prototype.thenNumber = function (func) {
    return this.number().then(func);
};

Promise.prototype.mapNumber = function () {
    return this.then(function (v) {
        return v ? v.map(function (o) {
            return Number(o);
        }) : [];
    });
};

Promise.prototype.thenMapNumber = function (func) {
    return this.mapNumber().map(func);
};

Promise.prototype.processExit = function () {
    return this.catch(function (err) {
        console.error('Error occurred while processing');
        console.error(err);
        console.error(err.stack);
    }).error(function (err) {
        console.error('Promise get rejected !!!');
        console.error(err);
        console.error(err.stack);
    }).done(function () {
        console.log('All Done');
        process.exit(0);
    });
};

Promise.prototype.catchAndDone = function (next) {
    var error;

    return this.catch(function (err) {
        error = err;
        console.log('Error occurred while processing');
        console.log(err);
        console.log(err.stack);
    }).error(function (err) {
        error = err;
        console.log('Promise get rejected !!!');
        console.log(err);
        console.log(err.stack);
    }).done(function () {
        next(error);
    });
};

module.exports = Promise;
