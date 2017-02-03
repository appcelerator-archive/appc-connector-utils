const debug = require('debug')('acu-main');
const schemaAPI = require('./lib/schema/api');
const modelAPI = require('./lib/model/api');
const endpointAPI = require('./lib/endpoint/api');
const testUtils = require('./lib/util/test');
const commonUtils = require('./lib/util/common');

module.exports = function (connector, options) {
	debug('OBTAIN API');
	return {
		createModels: function (modelDescriptions, options) {
			options = options || [];
			const models = modelAPI.createFromDescription(connector, modelDescriptions, options);
			if (!options.delayModelsAttachment) {
				connector.models = models;
			}
			return models;
		},
		createEndpoints: function (endpointDescriptions) {
			return endpointAPI.createEndpoints(endpointDescriptions);
		},
		processWithSchema: {
			createSchema: function (transformer, data) {
				return schemaAPI.createSchema(connector, transformer, data);
			},
			createModelsFromSchema: function (options) {
				options = options || [];
				const models = modelAPI.createModels(connector, options || {});
				if (!options.delayModelsAttachment) {
					connector.models = models;
				}
				return models;
			}
		},
		metadata: {
			getConnector: function () {
				return connector;
			},
			getConfiguration: function () {
				return connector.config;
			}
		},
		common: commonUtils,
		test: testUtils,
		// TODO Reconsider this one where to put it ???
		createModelsAndLoadFromFS: function (options) {
			options = options || [];
			const models = modelAPI.createModelsAndLoadFromFS(connector, options);
			if (!options.delayModelsAttachment) {
				connector.models = models;
			}
			return models;
		}		
	};
};
