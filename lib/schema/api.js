const Validator = require('../util/validate');
const Persister = require('../util/persist');
const schemaContract = require('./contract');

/**
 * transformer - synchronous transformer function that converts from input data to data that corresponds to the schema contract
 * data - the data to be transformed
 */
module.exports = {
	createSchema: function (connector, transformer, data) {
		const schema = transformer(connector, data);

		//TODO Error management - your transformer does not produce correct data
		Validator.validate(schema, schemaContract);

		if (connector.config.persistSchema) {
			Persister.saveSchemaSync(connector.config.schemaFileName, schema);
		}

		return schema;
	}
}