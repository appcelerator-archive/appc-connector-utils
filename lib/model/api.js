const Arrow = require('arrow')
const dataValidator = require('../tools/dataValidator')
const metadataSchema = require('./metadataSchema')

module.exports = {
  createFromMetadata: createFromMetadata
}

function createFromMetadata (connector, modelsMetadata) {
  if (!connector || !modelsMetadata) {
    throw new Error('Please provide both connector and metadata so Arrow could create models')
  }
  return Object.keys(modelsMetadata).reduce(function (previousModels, modelName) {
    const metadata = modelsMetadata[modelName]

    metadata.autogen = !!connector.config.modelAutogen
    metadata.generated = true
    metadata.connector = connector

    dataValidator.validate(metadata, metadataSchema)
    previousModels[modelName] = Arrow.createModel(modelName, metadata)
    return previousModels
  }, {})
}
