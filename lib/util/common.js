module.exports = {
	bindModelMethods: bindModelMethods
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
