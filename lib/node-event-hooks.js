var vm = require('vm'),
    fs = require('fs'),
    path = require('path'),
    eventHandlers = {
        'beforeRequire' : [],
        'afterRequire' : []
    },
    moduleParentDirectory = module.parent.filename.split('/').slice(0, -1).join('/') + '/';

function runHandlers(eventName, args) {
    eventHandlers[eventName].forEach(function(handler) {
        handler.apply(this, args);
    })
}

function getHookedRequire(originalRequire) {
    var newRequire = function(modulePath) {
        var firstCharacter = modulePath.substr(0, 1);
        if (firstCharacter === '/' || firstCharacter === '.') {
            modulePath = path.resolve(moduleParentDirectory + modulePath);
        }
        runHandlers('beforeRequire', [ modulePath ]);
        var localModule = originalRequire(modulePath);
        runHandlers('afterRequire', [ modulePath ]);
        return localModule;
    };

    for(var property in originalRequire) {
        newRequire[property] = originalRequire[property];
    }

    return newRequire;
}

module.exports.hookedRequire = getHookedRequire(require);

module.exports.on = function on(eventName, handler) {
    eventHandlers[eventName].push(handler);
};

module.exports.run = function runInNewContext(modulePath) {
    var fnString = fs.readFileSync(
        path.resolve(moduleParentDirectory + modulePath)
    );

    var context = {
        require: module.exports.hookedRequire,
        console: console,
        exports: {},
        module: {
            exports: {}
        },
        process: process,
    };

    vm.runInNewContext(fnString, context);
};