const debug = require('debug')('acu-main');
const Persister = require('./lib/util/persist');
const Validator = require('./lib/util/validate');
const schemaAPI = require('./lib/schema/api');
const modelAPI = require('./lib/model/api');

module.exports = function (connector, options) {
    return {
        createSchema: function(transformer, data) {
           return schemaAPI.createSchema(connector, transformer, data);
        },
        createModels: function(options) {
           return modelAPI.createModels(connector, options);
        },
        createModelsAndLoadFromFS: function(options) {
            return modelAPI.createModelsAndLoadFromFS(connector, options);
        },
        getConnector: function() {
            return connector;
        },
        getConfiguration: function() {
            return connector.config;
        }
    }
}