'use strict';

/**
 * Server start handler
 */
function serverStart(router, panic) {

	function serverHandler(req, res) {
		global.panic = panic.bind({res});
		(new router(...arguments)).init();
	}
	require('http').createServer(serverHandler).listen(8888);
}

module.exports = serverStart;