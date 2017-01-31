const debug = require('debug')('acu-validate');
const Joi = require('joi');

module.exports = {
	validate: validate
}

function validate(schema, contract) {
	Joi.validate(
		schema,
		contract,
		function (err, value) {
			if (err) {
				throw new Error(err);
			}
		}
	)
}
