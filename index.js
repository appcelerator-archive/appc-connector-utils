const debug = require('debug')('acu-main');
const schemaAPI = require('./lib/schema/api');
const modelAPI = require('./lib/model/api');
const testUtils = require('./lib/util/test');
const commonUtils = require('./lib/util/common');

module.exports = function (connector, options) {
	debug('OBTAIN API');
	return {
		createSchema: function (transformer, data) {
			return schemaAPI.createSchema(connector, transformer, data);
		},
		createModels: function (options) {
			return modelAPI.createModels(connector, options || {});
		},
		createModelsAndLoadFromFS: function (options) {
			return modelAPI.createModelsAndLoadFromFS(connector, options);
		},
		getConnector: function () {
			return connector;
		},
		getConfiguration: function () {
			return connector.config;
		}, 
		common: commonUtils,
		test: testUtils
	};
};
