const debug = require( 'debug' )( 'acu-test-runner' );
const test = require( 'tape' );
const tapSpec = require( 'tap-spec' );
const connectorUtils = require( '../index' );
const swaggerFacade = require( './example-swagger/facade' );
const swaggerTransformer = require( './example-swagger/transformer' );
const petstoreSwaggerURL = 'http://petstore.swagger.io/v2/swagger.json';
const EventEmitter = require( 'events' );
const myEmitter = new EventEmitter();
const serverFactory = require( './server/serverFactory' );
const config = require( './server/config' );
const request = require('request');

debug( 'Running the test suite...' );

test.createStream()
	.pipe( tapSpec() )
	.pipe( process.stdout );

var appServer, thirdPartyData, swaggerSchema;

// Mock the connector
var connector = {
	name: 'test',
	config: {
		modelAutogen: true,
		persistModels: false,
		persistSchema: false
	},
	emit: myEmitter.emit
};

const UTILS = connectorUtils( connector );


//TODO create server here and have it down to test against for having routes and models 
//Clean the contract about routes and models according to the documentation
//Fix the readme with more info and state that schema format is kind of unnecessary
//See Readme.md and github issues for more tasks

// test( '### Create Server ###', function ( t ) {
// 	serverFactory( config, function ( err, server ) {
// 		appServer = server;
// 		t.ok( server, 'server has been created' );
// 		t.end();
// 	})
// });

test( '### Fetch third-party service data ###', function ( t ) {
	// options = {
	// 	uri: "http://localhost:4000/arrow/docs.html",
	// 	method: 'GET',
	// 	auth: auth,
	// 	json: true
	// }

	request("http://localhost:4000/mytestendpoint", function (err, response, body) {
		console.log(err)
		console.log(response)
		console.log(body)
		t.end();
	});
	
	// swaggerFacade( petstoreSwaggerURL, function ( err, swaggerObject ) {
	// 	t.notOk( err, 'There are no errors while retrieving swagger document' );
	// 	t.ok( swaggerObject, 'Document is transformed to object' );
	// 	thirdPartyData = swaggerObject;
	// 	t.end();
	// });
});

// test( '### Write your schema factory and create schema out of it ###', function ( t ) {
// 	if ( !thirdPartyData ) {
// 		debug( 'WARNING: thirdPartyData is missing ... this will make your test fail' )
// 	}
// 	swaggerSchema = UTILS.createModelsViaSchema.createSchema( swaggerTransformer, thirdPartyData );
// 	t.ok( swaggerSchema, 'Schema created successfully' );
// 	t.end();
// });

// test( '### Create models out of schema provided with options (override the one in the connector) ###', function ( t ) {
// 	if ( !swaggerSchema ) {
// 		debug( 'WARNING: swaggerSchema is missing ... this will make your test fail' )
// 	}
// 	const models = UTILS.createModelsViaSchema.createModels( { schema: swaggerSchema, namespace: 'static' });
// 	t.ok( models, 'Models created successfully' );
// 	t.end();
// });

// test( '### Create models out of schema attached to connector - METHOD 2 ###', function ( t ) {
// 	const swaggerSchema = UTILS.createModelsViaSchema.createSchema( swaggerTransformer, thirdPartyData );
// 	UTILS.metadata.getConnector().schema = swaggerSchema;
// 	const models = UTILS.createModelsViaSchema.createModels();
// 	t.ok( models, 'Models created successfully' );
// 	t.end();
// });

// test( '### Should throw when schema is missing ###', function ( t ) {
// 	UTILS.metadata.getConnector().schema = null;
// 	t.throws( UTILS.createModelsViaSchema.createModels, 'Throws exception when schema is missing' );
// 	t.end();
// });

// test( '### Create Server ###', function ( t ) {
// 	appServer.stop(function() {
// 		t.pass('Server stoped successfully!')
// 		t.end();
// 	});
// });
