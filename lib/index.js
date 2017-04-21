const metadataValidator = require('./utils/metadataValidator')

module.exports = (Arrow, conn, options) => {
  options = options || {}
  const arrowUtils = require('./utils/arrow')(Arrow)
  const modelAPI = require('./model/api')(Arrow)
  const endpointAPI = require('./endpoint/api')(Arrow)
  const connector = arrowUtils.getConnectorStatic(conn).connector

  return {
    createCollectionFromModel: createCollectionFromModel,
    createInstanceFromModel: createInstanceFromModel,
    createModels: createModels,
    createEndpoints: endpointAPI.createEndpoints,
    getConnector: () => connector,
    getConnectorConfig: () => connector.config,
    validateModelMetadata: metadataValidator.validateModelMetadata,
    validateEndpointMetadata: metadataValidator.validateEndpointMetadata,
    getRootModelName: modelAPI.getRootModelName,
    test: {
      getConnectorStatic: arrowUtils.getConnectorStatic,
      getConnectorDynamic: arrowUtils.getConnectorDynamic,
      startArrowHttp: arrowUtils.startArrowHttp,
      stopArrowHttp: arrowUtils.stopArrowHttp
    }
  }
  function createCollectionFromModel (Model, modelsData, primaryKey) {
    return modelsData.map((modelData, index) => {
      return createInstanceFromModel(Model, modelData, primaryKey)
    })
  }
  function createInstanceFromModel (Model, data, primaryKey) {
    const instance = Model.instance(data, true)
    instance.setPrimaryKey(data[primaryKey])
    return instance
  }
  function createModels (modelsMetadata, options) {
    options = options || {}
    const models = preserveNamespace(modelAPI.createFromMetadata(connector, modelsMetadata))

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
