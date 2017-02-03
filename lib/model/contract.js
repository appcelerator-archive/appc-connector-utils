const Joi = require('joi');

const modelFieldsContract = Joi.object().pattern(/.*/, Joi.object({
	name: Joi.string(),
	type: Joi.string(),
	originalType: Joi.string(),
	description: Joi.string(),
	readonly: Joi.boolean(),
	maxlength: Joi.number(),
	required: Joi.boolean(),
	default: Joi.any(),
	optional: Joi.boolean(),
	model: Joi.string()
}));

const modelMethodsContract = Joi.object().pattern(/.*/, Joi.object({
	json: Joi.boolean(),
	generated: Joi.boolean(),
	verb: Joi.string(),
	url: Joi.string(),
	path: Joi.string(),
	autogen: Joi.boolean(),
	meta: Joi.object(),
	params: Joi.array()
}));

const modelContract = Joi.object({
	name: Joi.string().required(),
	fields: modelFieldsContract,
	connector: Joi.object(),
	autogen: Joi.boolean().required(),
	metadata: Joi.object(),
	generated: Joi.boolean().required(),
	methods: modelMethodsContract,
	actions: Joi.array(),
	disabledActions: Joi.array()
});

module.exports = modelContract;
