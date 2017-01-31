const debug = require('debug')('acu-model');
const fs = require('fs');
const path = require('path');

module.exports = {
	saveSchemaSync: saveSchemaSync,
	saveModelSync: saveModelSync,
	getModelsLocation: getModelsLocation
}

function saveSchemaSync(schemaName, schema) {
	const schemaLocation = getDirLocation('schema', schemaName);
	fs.writeFileSync(path.normalize(schemaLocation), JSON.stringify(schema, null, 2));
}

function saveModelSync(model, options) {

	//in case we persist models we need only the connector name
	if (model.connector.name) {
		model.connector = model.connector.name
	}

	const buffer = `var Arrow = require('arrow')
                    
var Model = Arrow.Model.extend('${model.name}', ${JSON.stringify(model, null, '\t')})

module.exports = Model`;

	fs.writeFileSync(path.join(getModelsLocation(options.namespace), model.name.toLowerCase() + '.js'), buffer);
}

/**
 * TODO make this with algorithm for temp directory used in salesforce connector
 */
function getDirLocation(folder, subFolder) {
	return path.join(process.cwd(), '..', 'generated-files', folder, subFolder);
}

function getModelsLocation(folder) {
	return getDirLocation('models', folder);
}
