const schemaContract = require('./contract/schema');
const modelsFactory = require('./model');

module.exports = {
    validateSchema: validateSchema,
    saveSchemaSync: Persister.saveSchemaSync,
    createModels: modelsFactory.createModels,
    createAndLoadModelsFromFiles: modelsFactory.createAndLoadModelsFromFiles
}

function validateSchema(schema) {
    Validator.validate(schema, schemaContract);
}