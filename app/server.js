'use strict';

function serverStart(router) {
	function serverHandler() {
		router.init(...arguments);
	}
	require('http').createServer(serverHandler).listen(3333);
}

module.exports = serverStart;