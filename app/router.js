'use strict';

/**
 * Prevent to answer on favicon.ico queries
 */
function stopFavicon(url, res) {
	if (url === 'favicon.ico') {
		res.writeHead(200, {"Content-Type": "image/x-icon"});
		res.end();
		return true;
	}
}

/**
 * Show "Page not found"
 */
function showPage404(res) {
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("Page not found");
}

/**
 * Initilize router module
 */
function init(req, res) {
	var url = require('url').parse(req.url).path.substr(1);

	if (stopFavicon(url, res)) {
		return;
	}

	function loadlist(err, data) {
		let list = JSON.parse(data);

		if (typeof list[url] === "undefined") {
			showPage404()
			return;
		}

		let controller = require('./controllers/' + list[url][0]);
		let instance = new controller(res);
		instance[list[url][1]]();
	}

	require('fs').readFile(rootDir + '/config/route.json', 'utf8', loadlist);
}


module.exports.init = init;