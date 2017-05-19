const pluralize = require('pluralize')
const dataValidator = require('../tools/dataValidator')
const metadataSchema = require('./metadataSchema')
const utils = require('../utils/fs')

module.exports = (Arrow) => {
  return {
    createFromMetadata: createFromMetadata,
    createFromFileSystem: createFromFileSystem,
    getRootModelName: getRootModelName
  }

  function createFromFileSystem (connector, modelsMetadata) {
    connector.modelDir = utils.createDir(connector.name)
    createFromMetadata(connector, modelsMetadata)
    return Arrow.loadModelsForConnector(connector.name, module, connector.modelDir)
  }

  /**
   * Create models in memory on persist them on disk depending on the configured strategy.
   *
   * @param {object} connector
   * @param {object} modelsMetadata
   * @return object that holds all the models or empty object in case we use persistence strategy
   */
  function createFromMetadata (connector, modelsMetadata) {
    if (!connector || !modelsMetadata) {
      throw new Error('Please provide both connector and metadata so Arrow could create models')
    }

    const loadModels = connector.config.generateModels

    return Object.keys(modelsMetadata).reduce(function (previousModels, modelName) {
      const persistModels = connector.config.persistModels
      if (loadModels && loadModels.indexOf(modelName) === -1) {
        return previousModels
      }
      const metadata = modelsMetadata[modelName]
      metadata.autogen = !!connector.config.modelAutogen
      metadata.generated = true
      metadata.connector = connector.name
      metadata.name = modelName

      dataValidator.validate(metadata, metadataSchema)

      if (persistModels) {
        utils.saveModelSync(createModelName(connector, modelName), metadata, connector.modelDir)
      } else {
        previousModels[modelName] = Arrow.createModel(createModelName(connector, modelName), metadata)
      }
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
