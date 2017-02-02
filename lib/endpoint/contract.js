const Joi = require('joi');

const endpointContract = Joi.object({
	group: Joi.string().required(),
	path: Joi.string().required(),
	method: Joi.string().required(),
	description: Joi.string(),
	model: Joi.string(),
	parameters: Joi.object(),
	action: Joi.func().required()
});

module.exports = endpointContract;

