const debug = require('debug')('acu-model');
const Arrow = require('arrow');
const Validator = require('../util/validate');
const Persister = require('../util/persist');
const modelContract = require('./contract');
const schemaContract = require('../schema/contract');

module.exports = {
	createFromDescription: createFromDescription,
	createModels: createModels,
	createModelsAndLoadFromFS: createModelsAndLoadFromFS
};

function createFromDescription(connector, modelDescriptions, options) {
	return Object.keys(modelDescriptions).reduce(function(previousModels, modelName) {
		const description = modelDescriptions[modelName];
		
		// default ones
		description.autogen = !!connector.config.modelAutogen;
		description.generated = true;

		Validator.validate(description, modelContract);
		previousModels[modelName] = Arrow.createModel(modelName, description);
		return previousModels;
	}, {});
}

// Supported options:
// options.schema -> the schema to be converted ... override connector schema useful when work with multiple schemas
// options.namespace -> overide config.namespace useful when work with multiple schemas
function createModels(connector, options) {
	const schema = options.schema || connector.schema;

	if (!schema) {
		throw new Error ('There is no schema neither in provided options nor in connector');
	} else {
		//Validate again because we could use this method with random schemas directly passed in options
		Validator.validate(schema, schemaContract);
	}
	
	return Object.keys(schema).reduce(function (models, objectName) {
		options.objectName = objectName;
		const model = createModel(connector, schema[objectName], options);
		models[model.name] = Arrow.Model.extend(model.name, model);
		return models;
	}, {})
};

/**
 * Use internal mechanism to load models.
 * It first create and persist models on the file system and then load them with static Arrow method.
 */
function createModelsAndLoadFromFS(connector, options) {
	//TODO check if the flags for persisting models are ok to inform the application
	// they are needed because this model loading strategy works with persisted models from the FS
	createModels(connector, options);
	return Arrow.loadModelsForConnector(connector.name, module, Persister.getModelsLocation(options.namespace));
}

/**
 * skipModelNamespace in your config allows you to skip namespacing
 * By default we take connector name to namespace models
 * The default namespace could be overriden with namespace options provided to createModel
 */
function createModelName(connector, options) {
	const namespace = options.namespace || connector.name;
	if (!connector.config.skipModelNamespace) {
		return `${namespace}-${options.objectName}`;
	}
	return options.objectName;
}

/**
 * Create object litteral (based on object data from schema) with structure appropriate to construct Arrow Model
 */
function createModel(connector, obj, options) {
	
	const model = {
		name: createModelName(connector, options),
		fields: obj.fields,
		connector: connector,
		autogen: !!connector.config.modelAutogen,
		metadata: {},
		generated: true,
		methods: {},
		// No actions no endpoints!
		// Checkout this one if empty we do not create endpoints 
		// But sometimes we need to be empty and have endpoints at the same time ?!?!?!?
		actions: [],
		disabledActions: obj.disabledActions || []		
	};
	model.metadata[connector.name] = {
		'object': `${options.objectName}`,
		'fields': obj.metadata
	};
	if (obj.methods && obj.methods.length > 0) {
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
