const Arrow = require ('arrow');
module.exports = function(config, callback) {
    const server = new Arrow(config);
	
	const myModel = Arrow.createModel( 'myTestModel', {
		name: "test",
		autogen: "true",
		metadata: {},
		generated: true
	});

	const myApi = new Arrow.API( {
		group: 'group',
		path: '/mytestendpoint',
		method: 'GET',
		description: 'Testing my endpoint description',
		parameters: {},
		action: function () { console.log( 'executing myendpoint action handler' ) }
	}, config, server );

	server.addModel( myModel );
	server.addAPI( myApi );
	
    server.start(function() {
		callback(null, server);
	});
}
