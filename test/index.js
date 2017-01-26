const debug = require('debug')('acu-test-runner');
const test = require('tape');
const tapSpec = require('tap-spec');
const connectorUtils = require('../lib');
const swaggerFacade = require('./example-swagger/facade');
const swaggerSchemaFactory = require('./example-swagger/schema-factory');
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
		persistModels: false
	},
	emit: myEmitter.emit
}

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
	swaggerSchema = swaggerSchemaFactory({}, thirdPartyData).create();
	t.ok(swaggerSchema, 'Schema created successfully');
	t.end();
})

test('### STEP 3: Validate and save the schema ###', function (t) {
	console.log('### STEP 3: Validate and save the schema ###');
	connectorUtils.validateSchema(swaggerSchema);
	//skip this until folder creation mechanism is introduced
	//connectorUtils.saveSchemaSync('swaggerSchema.json', swaggerSchema);
	t.end();

})

test('### STEP 4: Create models out of schema - METHOD 1 ###', function (t) {
	console.log('### STEP 4: Create models out of schema - METHOD 1 ###');
	const models = connectorUtils.createModels(swaggerSchema, {connector: connector, namespace: 'static'});
	t.ok(models, 'Models created successfully');
	t.end();
})

// test('### STEP 4: Create models out of schema - METHOD 2 ###', function (t) {
// 	const models = connectorUtils.createAndLoadModelsFromFiles(swaggerSchema, {connector: connector, namespace: 'static'});
// 	debug(models);
// 	t.ok(models, 'Models created successfully');
// 	t.end();	
// })