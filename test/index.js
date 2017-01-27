const debug = require('debug')('acu-test-runner');
const test = require('tape');
const tapSpec = require('tap-spec');
const connectorUtils = require('../index');
const swaggerFacade = require('./example-swagger/facade');
const swaggerTransformer = require('./example-swagger/transformer');
const petstoreSwaggerURL = 'http://petstore.swagger.io/v2/swagger.json';
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

var thirdPartyData, swaggerSchema;

//Mock the connector
var connector = {
	name: 'test',
	config: {
		modelAutogen: true,
		persistModels: false,
		persistSchema: false,
		bindModelMethods: true
	},
	emit: myEmitter.emit
}

const utils = connectorUtils(connector);

test('### STEP 1: Fetch third-party service data ###', function (t) {
	console.log('### STEP 1: Fetch third-party service data ###');
	swaggerFacade(petstoreSwaggerURL, function(err, swaggerObject) {
		t.notOk(err, 'There are no errors while retrieving swagger document');
		t.ok(swaggerObject, 'Document is transformed to object');
		thirdPartyData = swaggerObject
		t.end();
	})
})

test('### STEP 2: Write your schema factory and create schema out of it ###', function (t) {
	console.log('### STEP 2: Write your schema factory and create schema out of it ###');
	swaggerSchema = utils.createSchema(swaggerTransformer, thirdPartyData);
	t.ok(swaggerSchema, 'Schema created successfully');
	t.end();
})

test('### STEP 3: Create models out of schema - METHOD 1 ###', function (t) {
	console.log('### STEP 3: Create models out of schema - METHOD 1 ###');
	const models = utils.createModels({schema: swaggerSchema, namespace: 'static'});
	t.ok(models, 'Models created successfully');
	t.end();
})

test('### STEP 3: Create models out of schema - METHOD 2 ###', function (t) {
	// change current config to try another model loading strategy
	utils.getConfiguration().persistModels = true;
	const models = utils.createModelsAndLoadFromFS({schema: swaggerSchema, namespace: 'static'});
	t.ok(models, 'Models created successfully');
	t.end();
})