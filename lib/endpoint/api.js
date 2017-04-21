const endpointSchema = require('./endpointSchema')
const Validator = require('../utils/metadataValidator')

module.exports = (Arrow) => {
  return {
    createEndpoints: createEndpoints
  }

  function createEndpoints (endpointsDescriptions) {
    return endpointsDescriptions.map(function (description) {
      Validator.validate(description, endpointSchema)
      return Arrow.API.extend(description)
    })
  }
}
