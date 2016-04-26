'use strict';

var statServer = require('node-static');

var fileServer = new statServer.Server('.');

require('http').createServer(function (request, response) {
	request.addListener('end', function () {
		fileServer.serve(request, response, function (e, res) {
			if (e && (e.status === 404))
				fileServer.serveFile('/index.html', 200, {}, request, response);
		});
	}).resume();
}).listen(202);