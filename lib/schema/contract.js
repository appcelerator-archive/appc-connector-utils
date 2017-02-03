const Joi = require('joi');

const methodsParamsContract = Joi.array().items(Joi.object({
	in: Joi.string(),
	name: Joi.string(),
	description: Joi.string(),
	type: Joi.string(),
	required: Joi.boolean(),
	allowableValues: Joi.object(),
	isList: Joi.boolean(),
	enum: Joi.array()
}))

const methodOperationContract = Joi.object({
	operationId: Joi.string().required(),
	summary: Joi.string().required(),
	description: Joi.string()
});

const schemaMethodsContract = Joi.array().items(Joi.object({
	name: Joi.string().required(),
	params: methodsParamsContract,
	verb: Joi.string().required(),
	url: Joi.string().required(),
	path: Joi.string().required(),
	operation: methodOperationContract
}))

const schemaFieldsContract = Joi.object().pattern(/.*/, Joi.object({
	type: Joi.string(),
	required: Joi.boolean().required(),
	name: Joi.string(),
	originalType: Joi.string(),
	description: Joi.string(),
	readonly: Joi.boolean(),
	maxlength: Joi.number(),
	model: Joi.string()
}));

const schemaContract = Joi.object().pattern(/.*/, Joi.object({
	label: Joi.string().required(),
	fields: schemaFieldsContract,
	methods: Joi.array(),
	metadata: Joi.object(),
	disabledActions: Joi.array()
}));

module.exports = schemaContract;
