'use strict';

global.rootDir = require('path').resolve(__dirname);;

let router = require('./app/router');
require('./app/server').call(null, router);