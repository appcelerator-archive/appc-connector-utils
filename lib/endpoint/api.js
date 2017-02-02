const Arrow = require('arrow');
const endpointContract = reuqire('./contract');
const Validator = require('../util/validate');

module.exports = {
	createEndpoints: createEndpoints
};
function createEndpoints(endpointsDescriptions) {
	endpointsDescriptions.forEach(function(description) {
		Validator.validate(description, endpointContract);
		Arrow.API.extend(description);	
	});
}
