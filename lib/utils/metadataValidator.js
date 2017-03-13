const dataValidator = require('../tools/dataValidator')
const modelMetadataSchema = require('../model/metadataSchema')

module.exports = {
  validateModelMetadata: validateModelMetadata
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
