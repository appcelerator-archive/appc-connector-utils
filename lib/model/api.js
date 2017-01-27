const debug = require('debug')('acu-model');
const Arrow = require('arrow');
const Validator = require('../util/validate');
const Persister = require('../util/persist');
const modelContract = require('./contract');

module.exports = {
    createModels: createModels,
    createModelsAndLoadFromFS: createModelsAndLoadFromFS
}

function createModels(connector, options) {
    const schema = connector.schema;
    return Object.keys(schema).reduce(function (swaggerModels, objectName) {
        const model = createModel(connector, objectName, options);
        const arrowModel = Arrow.Model.extend(model.name, model);

        if (connector.config.bindModelMethods) {
            bindModelMethods(connector, arrowModel);
        }
        
        swaggerModels[arrowModel.name] = arrowModel;
        return swaggerModels;
    }, {})
}

/**
 * Use internal mechanism to load models.
 * It first create and persist models on the file system and then load them with static Arrow method.
 */
function createModelsAndLoadFromFS(connector, options) {
    //createAndPersistModels(schema, options);

    //TODO check if the flags for persisting models are ok to inform the application
    // they are needed because this model loading strategy works with persisted models from the FS

    createModels(connector, options);
    return Arrow.loadModelsForConnector(connector.name, module, Persister.getModelsLocation(options.namespace));
}

// function createAndPersistModels(connector, schema, options) {
//     Object.keys(schema).forEach(function (objectName) {
//         const model = createModel(connector, objectName, options);
//         Validator.validate(model, modelContract);
//         Persister.saveModelSync(model, options);
//     })
// }

function createModelName(namespace, modelName) {
    return `${namespace}-${modelName}`;
}

/**
 * Create object litteral (based on object data from schema) with structure appropriate to construct Arrow Model
 */
function createModel(connector, objectName, options) {
    const obj = connector.schema[objectName];
    const model = {
        name: createModelName(options.namespace, objectName),
        fields: obj.fields,
        connector: connector,
        autogen: !!connector.config.modelAutogen,
        metadata: {},
        generated: true,
        methods: {}
    };
    model.metadata[connector.name] = {
        'object': `${objectName}`,
        'fields': obj.metadata
    };
    if (obj.methods && obj.methods.length > 0) {
        // Note that when we have actions on model but they are empty Arrow does not create endpoints
        model.actions = [];
        obj.methods.forEach(function (method) {
            model.actions.push(method.name);
            model.methods[method.name] = {
                json: true,
                generated: true,
                verb: method.verb,
                url: method.url,
                path: method.path,
                autogen: !!connector.config.modelAutogen,
                meta: {
                    nickname: method.operation && method.operation.operationId,
                    summary: method.operation && method.operation.summary,
                    notes: method.operation && method.operation.description
                },
                params: method.params || (method.operation && method.operation.parameters)
            };
        })
    }
    //TODO Error Management
    Validator.validate(model, modelContract);
    if (connector.config.persistModels) {
        Persister.saveModelSync(model, options);
    }    
    return model;
}

function bindModelMethods(connector, model) {
    Object.keys(model.methods).forEach(function (methodName) {
        const method = model.methods[methodName];
        const context = {
            model: model,
            connector: connector,
            methodName: methodName,
            method: method,
            handleResponse: connector.config.handleResponse,
            getPrimaryKey: connector.config.getPrimaryKey
        };
        model[methodName] = connector.execute && connector.execute.bind(context);
        model[methodName + 'API'] = connector.describe && connector.describe.bind(context);
    })
}