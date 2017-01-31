const _ = require('lodash');
const _s = require('underscore.string');

module.exports = function (connector, swaggerObject) {
	const schema = {};
	const models = swaggerObject.definitions;
	const paths = swaggerObject.paths;
	const baseURL = getBaseURL(swaggerObject);

	// PROCESS MODELS
	Object.keys(models).forEach(function (modelName) {
		const parsedModelName = parseModelName(modelName);
		const modelData = models[modelName];
		schema[parsedModelName] = modelFactory(parsedModelName, modelData);
	});

	// PROCESS PATHS
	Object.keys(paths).forEach(function (path) {
		// TODO: FIXME The model name may not be in the path, we should look at params to tell
		const modelName = parseModelName(path);
		const methods = paths[path];
		var model = schema[modelName];
		if (!model) {
			model = schema[modelName] = {
				label: modelName,
				fields: {},
				methods: []
			}
		};
		Object.keys(methods).forEach(function (method) {
			const methodProperties = methods[method];
			if (!(method === 'parameters')) {
				model.methods.push(getModelMethod(methodProperties, path, method, baseURL))
			};
		});
	});

	return schema;
};

function getModelMethod(methodProperties, path, method, baseURL) {
	const methodName = methodProperties.operationId || parseMethodName(connector.config, method, path);
	const globalParams = method.parameters || {};
	return {
		// TODO: Need to implement method overriding (aka: same name, different signatures).
		name: methodName,
		params: translateParameters(_.defaults(methodProperties.parameters, globalParams)),
		verb: method.toUpperCase(),
		url: baseURL + path,
		path: path,
		operation: {
			operationId: methodProperties.operationId,
			summary: methodProperties.summary,
			description: methodProperties.description
		}
	};
}

function modelFactory(modelName, modelData) {
	const model = {
		label: modelName,
		methods: [],
		fields: {}
	}
	const properties = modelData.properties;
	const requiredProperties = modelData.required || [];

	properties && processProperties(properties);

	return model;

	function processProperties(properties) {
		Object.keys(properties).forEach(function (propertyName) {
			if ('id' !== propertyName) {
				addModelField(propertyName)
			}
		});
	}

	function addModelField(propertyName) {
		const property = properties[propertyName];
		model.fields[propertyName] = {
			type: translateType(property),
			required: requiredProperties.indexOf(propertyName) !== -1
		};
	}
}

function getBaseURL(swaggerObject) {
	var baseURL = `${(swaggerObject.schemes && swaggerObject.schemes[0]) || 'https'}://${swaggerObject.host}`;
	if (swaggerObject.basePath) {
		baseURL += swaggerObject.basePath;
	}
	return baseURL;
}


/**
 * Hacks the parameters to remove properties injected by swagger-client for model references.
 * Using them causes circular references, which breaks the process later on.
 *
 * @param {Object} params
 * @param {Object} modified params
 */
function translateParameters(params) {
	var newParam = [];
	_.forEach(params, function (param) {
		if (param.schema && param.schema.$ref) {
			var type = param.modelSignature && param.modelSignature.type,
				model = type && param.modelSignature.definitions && param.modelSignature.definitions[type],
				definition = model && model.definition,
				properties = definition && definition.properties,
				required = definition && definition.required || [];

			_.forEach(properties, function (val, key) {
				if ('id' !== key) {
					newParam.push({
						in: param.in,
						name: key,
						type: val.type || 'object',
						description: val.description,
						required: required.indexOf(key) !== -1
					});
				}
			});
		} else {
			newParam.push(param);
			delete param.modelSignature; // This is circular reference to model if the param is a model!
			delete param.responseClassSignature;
			delete param.signature;
			delete param.sampleJSON;
		}
	});

	return newParam;
}

/**
 * Translate from Swagger type to JS type
 * @param {Object} prop
 * @returns {string}
 */
function translateType(prop) {
	var complexType = prop.type;
	const typeMap = {
		'array': 'Array',
		'integer': 'Integer',
		'integer.int32': 'Integer',
		'integer.int64': 'Integer',
		'number': 'Number',
		'number.double': 'Number',
		'number.float': 'Number',
		'string': 'String',
		'string.byte': 'String',
		// binary not supported in JavaScript client right now, using String as a workaround
		'string.binary': 'String',
		'boolean': 'Boolean',
		'string.date': 'Date',
		'string.date-time': 'Date',
		'string.password': 'String',
		'file': 'File',
		'object': 'Object'
	};
	if (prop.format) {
		complexType = complexType + '.' + prop.format;
	}
	return typeMap[complexType];
}

/**
 * Grabs the first component of the path as a name.
 * @param path
 * @returns {*}
 */
function parseModelName(path) {
	var segments = [];
	if ('/' === path.charAt(0)) {
		path = path.slice(1);
	}
	segments = path.split('/');
	// Often the first path segment may be an API version number
	if (segments.length > 1 && segments[0].match(/^v?(\d+([\.\d+])*)/)) {
		return _s.classify(segments[1]);
	}
	return _s.classify(segments[0]);
}

/**
 * Parses path variables from a swagger formatted URL.
 * @param url A swagger formatted url, such as http://foo.com/bar/{id}
 * @returns {Array}
 */
function parsePathVars(url) {
	return (url.match(/\{[^}]*\}/g) || []).map(function (pathVar) {
		return pathVar.slice(1, -1);
	});
}

/**
 * Turns an HTTP verb and path in to a method name.
 *
 * Examples:
 * GET app -> findAll
 * POST app -> create
 * GET app/{id} -> findOne
 * POST app/saveFromTiApp -> createSaveFromTiApp
 * PUT app/{id} -> update
 * GET app/{app_guid}/module/{module_guid}/verification -> findModuleVerification
 * DELETE acs/{app_guid}/push_devices/{app_env}/unsubscribe -> deletePushDevicesUnsubscribe
 */
function parseMethodName(options, verb, path) {
	var name,
		components = path.split('/'),
		verbMap = (options && options.verbMap) || {
			POST: 'create',
			GET: 'find',
			PUT: 'update',
			DELETE: 'delete'
		};

	// Ensure we have a verb.
	verb = (verb || 'GET').toUpperCase();
	// Remove the leading slash.
	if ('/' === path.charAt(0)) {
		components.splice(0, 1);
	}

	// Remove the first path component (it's the models name).
	components.splice(0, 1);

	// Turn the HTTP verb in to the start of the method name.
	name = verbMap[verb] || verbMap.GET;

	// Append the remaining path components as part of the name, excluding path vars.
	if (!components.length) {
		if (verb !== 'POST') {
			name += 'All';
		}
	} else {
		var allParams = true;
		for (var i = 0; i < components.length; i++) {
			var component = components[i];
			if (component.charAt(0) !== '{') {
				name += hasChars(component, '_-.') ? _s.classify(component) : _s.capitalize(component);
				allParams = false;
			}
		}
		if (allParams && verb === 'GET') {
			name += 'One';
		}
	}

	return name;
}

/**
 * Checks if a string contains at least one of the specified characters.
 * @param str A string, such as "foo".
 * @param chars A string or array, such as "fo" or [ 'f', 'o' ].
 * @returns {boolean}
 */
function hasChars(str, chars) {
	for (var i = 0; i < chars.length; i++) {
		if (hasChar(str, chars[i])) {
			return true;
		}
	}
	return false;
}

/**
 * Checks if a string contains the specified character.
 * @param str A string, such as "foo".
 * @param char A character, such as 'f'.
 * @returns {boolean}
 */
function hasChar(str, char) {
	return str.indexOf(char) >= 0;
}
