const dataValidator = require('../utils/dataValidator')
const endpointSchema = require('./endpointSchema')

module.exports = (Arrow) => {
  return {
    createEndpoints: createEndpoints
  }

  function createEndpoints (endpointsDescriptions) {
    return endpointsDescriptions.map(function (description) {
      dataValidator.validate(description, endpointSchema)
      return Arrow.API.extend(description)
    })
  }
}
