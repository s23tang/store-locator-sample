/* Dependencies */
var express = require('express'),
    http = require('http'),
    app = express(),
    opts = require(__dirname + '/config/opts.js');

// Load express configuration
require(__dirname + '/config/env.js')(express, app);

// Load controllers
app.use(require(__dirname + '/controllers'));

// Start the server
app.listen(3000);
