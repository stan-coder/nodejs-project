'use strict';

global.rootDir = require('path').resolve(__dirname);;

let router = require(`${rootDir}/app/router`);
require(`${rootDir}/app/server`)(router);