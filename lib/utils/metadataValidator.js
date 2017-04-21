const dataValidator = require('../tools/dataValidator')
const modelMetadataSchema = require('../model/metadataSchema')
const endpointMetadataSchema = require('../endpoint/endpointSchema')

module.exports = {
  validateModelMetadata: validateModelMetadata,
  validateEndpointMetadata: validateEndpointMetadata
}

/**
 * Validates model metadata against schema.
 *
 * @param {Object} modelMetadata the metadata that must be validated
 */
function validateModelMetadata (modelMetadata) {
  if (modelMetadata) {
    return dataValidator.validate(modelMetadata, modelMetadataSchema)
  }
}

/**
 * Validates endpoint metadata against schema.
 *
 * @param {Object} endpointMetadata the metadata that must be validated
 */
function validateEndpointMetadata (endpointMetadata) {
  if (endpointMetadata) {
    return dataValidator.validate(endpointMetadata, endpointMetadataSchema)
  }
}
