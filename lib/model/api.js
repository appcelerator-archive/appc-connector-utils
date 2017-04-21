const pluralize = require('pluralize')
const dataValidator = require('../utils/dataValidator')
const metadataSchema = require('./metadataSchema')

module.exports = (Arrow) => {
  return {
    createFromMetadata: createFromMetadata,
    getRootModelName: getRootModelName
  }

  function createFromMetadata (connector, modelsMetadata) {
    if (!connector || !modelsMetadata) {
      throw new Error('Please provide both connector and metadata so Arrow could create models')
    }

    const loadModels = connector.config.generateModels

    return Object.keys(modelsMetadata).reduce(function (previousModels, modelName) {
      if (loadModels && loadModels.indexOf(modelName) === -1) {
        return previousModels
      }

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
  function getRootModelName (model) {
    if (!model) {
      throw new Error('Please provide Arrow Model')
    }

    const namespaceDelimiter = '/'
    var parent = model
    while (parent._parent && parent._parent.name) {
      parent = parent._parent
    }
    if (!parent.name) {
      throw new Error('The provided model has no name or parent with name')
    }
    const name = parent.name.split(namespaceDelimiter).pop()
    return {
      nameOnly: name,
      nameOnlyPlural: pluralize(name),
      withNamespace: parent.name
    }
  }

  function createModelName (connector, modelName) {
    const cfg = connector.config
    return cfg.skipModelNamespace ? `${modelName}` : `${cfg.modelNamespace || connector.name}/${modelName}`
  }
}
