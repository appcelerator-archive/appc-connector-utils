const Arrow = require('arrow')
const SKIP_HTTP_SERVER = true
const DEFAULT_CONNECTOR_NAME = 'appc.test'

module.exports = {
  createArrow: createArrow,
  createArrowAndConnector: createArrowAndConnector,
  createConnector: createConnector,
  createArrowAndStartHTTPServer: createArrowAndStartHTTPServer,
  getParentModelName: getParentModelName
}

/**
 * This one only instantiate Arrow so you can use connectors and load the models
 *
 * @param {Object} config  Arrow configuration object
 * @param {Boolean} connect if true the connector dynamic discovery lifecycle is triggered
 */
function createArrowAndConnector (config, options) {
  options = options || {}
  const server = new Arrow(config || {}, SKIP_HTTP_SERVER)
  /**
   * search for connector first and if not present create one
   */
  const connector = server.getConnector(options.connectorName || DEFAULT_CONNECTOR_NAME) || createConnector(config, options)

  /**
   * connector.connect invokes the generate models lifecycle.
   * it includes fetching data from third party data source and transforming it to models
   */
  options.connect && connector.connect()
  return { server: server, connector: connector }
}

/**
 * Creates Arrow Connector
 */
function createConnector (config, options) {
  options = options || {}
  const Connector = Arrow.Connector.extend({
    name: options.connectorName || DEFAULT_CONNECTOR_NAME,
    connect: function () {},
    create: function (Model, value, callback) {}
  })
  return new Connector(config)
}

/**
 * This one only instantiate Arrow so you can use connectors and load the models
 *
 * @param {Object} config  Arrow configuration object
 * @param {Boolean} connect if true the connector dynamic discovery lifecycle is triggered
 */
function createArrow (config) {
  return new Arrow(config || {}, SKIP_HTTP_SERVER)
}

/**
 * This one expose Arrow http server based on Express
 *
 * @param {Object} config Arrow configuration object
 * @param {Function} callback callback executed after Arrow HTTP server is started
 */
function createArrowAndStartHTTPServer (config, callback) {
  const server = new Arrow(config || {}, !SKIP_HTTP_SERVER)
  server.start(function () {
    callback(server)
  })
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
