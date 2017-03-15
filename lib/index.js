const modelAPI = require('./model/api')
const metadataValidator = require('./utils/metadataValidator')
const arrowUtils = require('./utils/arrow')
const modelUtils = require('./utils/model')

module.exports = function (connector, options) {
  return {
    createModels: createModels,
    getConnector: () => connector,
    getConnectorConfig: () => connector.config,
    validateModelMetadata: metadataValidator.validateModelMetadata,
    getParentModelName: modelUtils.getParentModelName,
    arrow: {
      create: arrowUtils.createArrow,
      createWithConnector: arrowUtils.createArrowWithConnector,
      createWithConnectorAndConnect: arrowUtils.createArrowWithConnectorAndConnect,
      createWithHTTPServer: arrowUtils.createArrowWithHTTPServer
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
