'use strict';

/**
 * Errors handler
 */
function errorHandler(err) {
	if (err) {
		var mess;
		if (settings.mode === 'development') {
			mess = 'The error is:';
			for (let key in err) {
				mess += `\n${key}: ${err[key]}`;
			}
		} else {
			mess = 'Sory, but there is some problem with server!';
		}
		console.error(err);

		this.res.writeHead(500, {'Content-Type': 'text/plain'});
		this.res.end(mess);
		return true;
	}
}

/**
 * Settings loader
 */
module.exports.loadSettings = function (err, data) {
	global.settings = JSON.parse(data);

	let router = require(`${rootDir}/app/router`);
	require(`${rootDir}/app/server`)(router, errorHandler);
}