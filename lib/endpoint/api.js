const Arrow = require('arrow');
const endpointContract = require('./contract');
const Validator = require('../util/validate');

module.exports = {
	createEndpoints: createEndpoints
};
function createEndpoints(endpointsDescriptions) {
	return endpointsDescriptions.map(function(description) {
		Validator.validate(description, endpointContract);
		return Arrow.API.extend(description);	
	});
}
