const debug = require('debug')('acu-test-runner');
const test = require('tape');
const tapSpec = require('tap-spec');
const connectorUtils = require('../index');
const swaggerFacade = require('./example-swagger/facade');
const swaggerTransformer = require('./example-swagger/transformer');
const petstoreSwaggerURL = 'http://petstore.swagger.io/v2/swagger.json';
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

debug('Running the test suite...');

test.createStream()
	.pipe(tapSpec())
	.pipe(process.stdout);

var thirdPartyData, swaggerSchema;

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

const utils = connectorUtils(connector);

test('### Fetch third-party service data ###', function (t) {
	debug('### STEP 1: Fetch third-party service data ###');
	swaggerFacade(petstoreSwaggerURL, function (err, swaggerObject) {
		t.notOk(err, 'There are no errors while retrieving swagger document');
		t.ok(swaggerObject, 'Document is transformed to object');
		thirdPartyData = swaggerObject;
		t.end();
	});
});

test('### Write your schema factory and create schema out of it ###', function (t) {
	debug('### STEP 2: Write your schema factory and create schema out of it ###');
	swaggerSchema = utils.createSchema(swaggerTransformer, thirdPartyData);
	t.ok(swaggerSchema, 'Schema created successfully');
	t.end();
});

test('### Create models out of schema provided with options (override the one in the connector) ###', function (t) {
	debug('### STEP 3 / METHOD 1: Create models out of schema  provided with options (override the one in the connector) ###');
	const models = utils.createModels({ schema: swaggerSchema, namespace: 'static' });
	t.ok(models, 'Models created successfully');
	t.end();
});

test('### Create models out of schema attached to connector - METHOD 2 ###', function (t) {
	debug('### STEP 3 / METHOD 2: Create models out of schema attached to connector ###');
	const swaggerSchema = utils.createSchema(swaggerTransformer, thirdPartyData);	
	utils.getConnector().schema = swaggerSchema;
	const models = utils.createModels();
	t.ok(models, 'Models created successfully');
	t.end();
});

test('### Should throw when schema is missing ###', function (t) {
	utils.getConnector().schema = null;
	t.throws(utils.createModels, 'Throws exception when schema is missing');
	t.end();
});
