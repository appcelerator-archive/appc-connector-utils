const config = require( './config.js' );
const serverFactory = require('./serverFactory.js')(config, addSampleModeAndAPI);

function addSampleModeAndAPI(err, server) {
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
}
