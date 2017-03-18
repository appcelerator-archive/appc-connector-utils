const metadataValidator = require('./utils/metadataValidator')

module.exports = (Arrow, conn, options) => {
  options = options || {}
  const arrowUtils = require('./utils/arrow')(Arrow)
  const modelAPI = require('./model/api')(Arrow)
  const connector = arrowUtils.getConnectorStatic(conn).connector

  return {
    createModels: createModels,
    getConnector: () => connector,
    getConnectorConfig: () => connector.config,
    validateModelMetadata: metadataValidator.validateModelMetadata,
    getParentModelName: modelAPI.getParentModelName,
    test: {
      getConnectorStatic: arrowUtils.getConnectorStatic,
      getConnectorDynamic: arrowUtils.getConnectorDynamic,
      startArrowHttp: arrowUtils.startArrowHttp,
      stopArrowHttp: arrowUtils.stopArrowHttp
    }
  }

  function createModels (modelsMetadata, options) {
    options = options || {}
    const models = modelAPI.createFromMetadata(connector, modelsMetadata)
    if (!options.delayModelsAttachment) {
      connector.models = models
    }
    return models
  }
}
