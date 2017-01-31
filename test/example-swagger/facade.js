const SwaggerClient = require('swagger-client');

module.exports = function (url, callback) {
	var client;

	const clientOptions = {
		url: url,
		success: function () {
			callback(null, client.swaggerObject);
		},
		failure: function (err) {
			callback(err);
		}
	};

	client = new SwaggerClient(clientOptions);
}
