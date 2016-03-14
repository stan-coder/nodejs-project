'use strict';

/**
 * Server start handler
 */
function serverStart(router, errorHandler) {

	function serverHandler(req, res) {
		global.errorHandler = errorHandler.bind({res});
		(new router(...arguments)).init();
	}
	require('http').createServer(serverHandler).listen(8888);
}

module.exports = serverStart;