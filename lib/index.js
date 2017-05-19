const metadataValidator = require('./utils/metadataValidator')
const fsUtils = require('./utils/fs')

module.exports = (Arrow, conn, options) => {
  options = options || {}
  const arrowTestUtils = require('./utils/test/arrow')(Arrow)
  const modelAPI = require('./model/api')(Arrow)
  const endpointAPI = require('./endpoint/api')(Arrow)
  const connector = arrowTestUtils.getConnectorStatic(conn).connector

  return {
    context: {
      config: connector.config,
      connector: connector
    },
    load: {
      models: createModels,
      endpoints: endpointAPI.createEndpoints
    },
    create: {
      arrowCollection: createArrowCollection,
      modelInstance: createModelInstance
    },
    validate: {
      modelMetadata: metadataValidator.validateModelMetadata,
      endpointMetadata: metadataValidator.validateEndpointMetadata
    },
    test: {
      getConnectorStatic: arrowTestUtils.getConnectorStatic,
      getConnectorDynamic: arrowTestUtils.getConnectorDynamic,
      startArrowHttp: arrowTestUtils.startArrowHttp,
      stopArrowHttp: arrowTestUtils.stopArrowHttp
    },
    getRootModelName: modelAPI.getRootModelName,
    createDir: fsUtils.createDir
  }
  function createArrowCollection (Model, modelsData, primaryKey) {
    return new Arrow.Collection(Model, modelsData.map((modelData, index) => {
      return createModelInstance(Model, modelData, primaryKey)
    }))
  }
  function createModelInstance (Model, data, primaryKey) {
    const instance = Model.instance(data, true)
    instance.setPrimaryKey(data[primaryKey])
    return instance
  }
  function createModels (modelsMetadata, options) {
    options = options || {}
    var models
    const persistModels = connector.config.persistModels
    if (persistModels) {
      models = preserveNamespace(modelAPI.createFromFileSystem(connector, modelsMetadata))
    } else {
      models = preserveNamespace(modelAPI.createFromMetadata(connector, modelsMetadata))
    }

    if (!options.delayModelsAttachment) {
      connector.models = models
    }

    return models
  }

  /**
   * Preserves the models namspaces if it exists.
   *
   * @param {Array} models the array of existing models
   */
  function preserveNamespace (models) {
    const prefixedModels = {}
    if (connector.config.skipModelNamespace) {
      // if namspace is not applied we do not need to preserve it
      return models
    } else {
      for (var model in models) {
        prefixedModels[models[model].name] = models[model]
      }
      return prefixedModels
    }
  }
}
