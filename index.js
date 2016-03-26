'use strict';

/**
 * Author: Stanislav Zavalishin
 * Email: stan.coder@gmail.com
 */

global.rootDir = require('path').resolve(__dirname);

let settingsPath = `${rootDir}/config/settings.json`;
let incPath = `${rootDir}/app/inc.js`;

require('fs').readFile(settingsPath, 'utf8', require(incPath).loadSettings);