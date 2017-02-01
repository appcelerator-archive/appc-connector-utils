const debug = require('debug')('acu-validate');
const Joi = require('joi');
const Validator = require('./validate');
const schemaContract = require('../schema/contract');
const modelContract = require('../model/contract');

module.exports = {
	testSchema: testSchema,
	testModel: testModel,
	printSchemaContract: printSchemaContract,
	printModelContract: printModelContract
}

function testSchema(schema) {
	Validator.validate(schema, schemaContract);
}

function testModel(model) {
	Validator.validate(model, modelContract);
}

function printSchemaContract(loggerFunction) {
	// TODO
	// if (loggerFunction) {
	// 	loggerFunction(schemaContract);
	// } else {
	// 	console.log(schemaContract);
	// }
}

function printModelContract(loggerFunction) {
	// TODO
	// if (loggerFunction) {
	// 	loggerFunction(modelContract);
	// } else {
	// 	console.log(modelContract);
	// }	
}
