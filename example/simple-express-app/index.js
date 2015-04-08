var eventHooks = require('../../lib/node-event-hooks');

eventHooks.on('beforeRequire', function() {
    this.requireStartTime = Date.now();
});

eventHooks.on('afterRequire', function(path) {
    console.log("Took %dms to require '%s'...", Date.now() - this.requireStartTime, path);
});

eventHooks.run("./www.js");