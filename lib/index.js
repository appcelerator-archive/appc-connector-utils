const metadataValidator = require('./utils/metadataValidator')

module.exports = (Arrow, conn, options) => {
  options = options || {}
  const container = Arrow.getGlobal()
  const connector = getConnector(container, conn)
  const modelAPI = require('./model/api')(Arrow)

  if (!connector) {
    throw new Error('You must specify options.connector or options.connectorName to create connector')
  }

  return {
    createModels: createModels,
    getConnector: () => connector,
    getConnectorConfig: () => connector.config,
    validateModelMetadata: metadataValidator.validateModelMetadata,
    getParentModelName: modelAPI.getParentModelName
  }

  function getConnector (container, connector) {
    if (!connector) {
      throw new Error('There is no connector information')
    }

    if (typeof connector === 'object') {
      return connector
    }

    if (typeof connector === 'string') {
      return container.getConnector(connector)
    }

    throw new Error('Invalid connector type passed. Pass the connector instance or connector name.')
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
