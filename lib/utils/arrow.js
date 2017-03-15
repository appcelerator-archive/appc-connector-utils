const Arrow = require('arrow')
const SKIP_HTTP_SERVER = true
const DEFAULT_CONNECTOR_NAME = 'appc.test'
const DEFAULT_CONNECTOR_METADATA = {
  name: DEFAULT_CONNECTOR_NAME,
  connect: function () { },
  create: function (Model, value, callback) { }
}

module.exports = {
  createArrow: createArrow,
  createArrowWithConnector: createArrowWithConnector,
  createArrowWithConnectorAndConnect: createArrowWithConnectorAndConnect,
  createArrowWithHTTPServer: createArrowWithHTTPServer
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
 * This one only instantiate Arrow so you can use connectors and load the models.
 * Only static models are available in this case.
 *
 * @param {Object} config  Arrow configuration object
 * @param {Boolean} connect if true the connector dynamic discovery lifecycle is triggered
 */
function createArrowWithConnector (options) {
  const server = new Arrow(options.arrowConfig || {}, SKIP_HTTP_SERVER)
  /**
   * search for connector first and if not present create one
   */
  const connector = server.getConnector(options.connectorName || DEFAULT_CONNECTOR_NAME) || createConnector(options)
  return { server: server, connector: connector }
}

/**
 * This one only instantiate Arrow so you can use connectors and load the models.
 * This method ensure that dynamic models are available as well.
 *
 * @param {Object} config  Arrow configuration object
 * @param {Boolean} connect if true the connector dynamic discovery lifecycle is triggered
 */
function createArrowWithConnectorAndConnect (options) {
  const arrow = createArrowWithConnector(options)
  /**
   * connector.connect invokes the generate models lifecycle.
   * it includes fetching data from third party data source and transforming it to models
   */
  arrow.connector.connect()
  return { server: arrow.server, connector: arrow.connector }
}

/**
 * This one expose Arrow http server based on Express
 *
 * @param {Object} config Arrow configuration object
 * @param {Function} callback callback executed after Arrow HTTP server is started
 */
function createArrowWithHTTPServer (config, callback) {
  const server = new Arrow(config || {}, SKIP_HTTP_SERVER)
  /**
   * Arrow can be started in http mode immediately but then asynchronous testing is not working well.
   * That is why we use start explicitely after that.
   */
  server.start(() => {
    callback(server)
  })
}

/**
 * Creates Arrow Connector
 *
 * @param options.metadata metadata used to create connector
 * @param options.connectorConfig config file for the connector
 */
function createConnector (options) {
  const metadata = options.metadata || DEFAULT_CONNECTOR_METADATA
  const Connector = Arrow.Connector.extend(metadata)
  return new Connector(options.connectorConfig)
}

