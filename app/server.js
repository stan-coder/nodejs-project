'use strict';

function serverStart(router) {
	function serverHandler() {
		(new router(...arguments)).init();
	}
	require('http').createServer(serverHandler).listen(3333);
}

module.exports = serverStart;