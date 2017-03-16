const dataValidator = require('../tools/dataValidator')
const metadataSchema = require('./metadataSchema')

module.exports = (Arrow) => {
  return {
    createFromMetadata: createFromMetadata,
    getParentModelName: getParentModelName
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
      previousModels[modelName] = Arrow.createModel(createModelName(connector, modelName), metadata)
      return previousModels
    }, {})
  }

  /**
   * Gets parent model name or if the model has no parent the model name itself.
   *
   * @param {Arrow.Model} model the model which name must be evaluated
   * @return {Object} object literal that contains the clean and namespaced model name
   */
  function getParentModelName (model) {
    const namespaceDelimiter = '/'
    var parent = model
    while (parent._parent && parent._parent.name) {
      parent = parent._parent
    }
    if (!parent.name) {
      throw new Error('The provided model has no parent with name and has no name itself')
    }
    return {
      nameOnly: parent.name.split(namespaceDelimiter).pop(),
      withNamespace: parent.name
    }
  }

  function createModelName (connector, modelName) {
    const cfg = connector.config
    return cfg.skipModelNamespace ? `${modelName}` : `${cfg.modelNamespace || connector.name}/${modelName}`
  }
}

