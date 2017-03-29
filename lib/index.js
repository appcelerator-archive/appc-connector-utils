const metadataValidator = require('./utils/metadataValidator')

module.exports = (Arrow, conn, options) => {
  options = options || {}
  const arrowUtils = require('./utils/arrow')(Arrow)
  const modelAPI = require('./model/api')(Arrow)
  const connector = arrowUtils.getConnectorStatic(conn).connector

  return {
    createCollectionFromModel: createCollectionFromModel,
    createInstanceFromModel: createInstanceFromModel,
    createModels: createModels,
    getConnector: () => connector,
    getConnectorConfig: () => connector.config,
    validateModelMetadata: metadataValidator.validateModelMetadata,
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
    const models = modelAPI.createFromMetadata(connector, modelsMetadata)
    const prefixedModels = {}
    var model

    for (model in models) {
      prefixedModels[models[model].name] = models[model]
    }

    if (!options.delayModelsAttachment) {
      connector.models = prefixedModels
    }

    return prefixedModels
  }
}
