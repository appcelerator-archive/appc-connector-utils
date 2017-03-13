const modelAPI = require('./model/api')
const metadataValidator = require('./utils/metadataValidator')
const arrowUtils = require('./utils/arrow')

module.exports = function (connector, options) {
  return {
    createModels: function (modelsMetadata, options) {
      options = options || {}
      const models = modelAPI.createFromMetadata(connector, modelsMetadata)
      if (!options.delayModelsAttachment) {
        connector.models = models
      }
      return models
    },
    getConnector: () => connector,
    getConnectorConfig: () => connector.config,
    utils: {
      validateModelMetadata: metadataValidator.validateModelMetadata,
      startHTTPArrow: arrowUtils.startHTTPArrow,
      startPlainArrow: arrowUtils.startPlainArrow,
      createConnector: arrowUtils.createConnector
    }
  }
}
