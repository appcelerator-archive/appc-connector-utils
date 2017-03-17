module.exports = Arrow => {
  const ENV = {
    Arrow: Arrow,
    container: null,
    connector: null,
    httpStarted: false
  }

  return {
    getConnectorStatic: getConnectorStatic,
    getConnectorDynamic: getConnectorDynamic,
    startArrowHttp: startArrowHttp,
    stopArrowHttp: stopArrowHttp,
    getConnector: getConnector
  }

  /**
   * Synchronous function.
   * Constructs the connector with static models only.
   * No HTTP server started after it.
   *
   * @param {String/Object} conn Mandatory. Either connector instance of type Arrow.Connector or the string name of the connector will work.
   * @param {Object} cfg Optional. Configuration for Arrow Container.
   * @return environment that contains the Arrow dependency, container, and connector
   */
  function getConnectorStatic (conn, cfg) {
    if (ENV.connector) {
      return ENV
    }
    // guarantees that container is available
    startContainerPlain(cfg)
    ENV.connector = getConnector(ENV.container, conn)
    return ENV
  }

  /**
   * Asynchronous function.
   * Constructs the connector with static and dynamics models.
   * No HTTP server started after it.
   *
   * @param {String/Object} conn connector object or connector name
   * @param {Function} callback the callback that will be invoked after operation is finished
   * @param {Object} cfg Optional. Configuration for Arrow Container.
   * @return environment that contains the Arrow dependency, container, and connector
   */
  function getConnectorDynamic (conn, callback, cfg) {
    getConnectorStatic(conn, cfg)
    ENV.connector.connect(() => {
      callback(ENV)
    })
  }

  /**
   * Asynchronous function.
   * Constructs the connector with static and dynamics models and starts
   * Start HTTP server after it.
   *
   * @param {String/Object} conn connector object or connector name
   * @param {Function} callback the callback that will be invoked after operation is finished
   * @param {Object} cfg Optional. Configuration for Arrow Container.
   * @return environment that contains the Arrow dependency, container, and connector
   */
  function startArrowHttp (conn, callback, cfg) {
    if (ENV.httpStarted) {
      process.nextTick(() => {
        callback(ENV)
      })
    } else {
      /**
       * new Arrow sets up the express app and needed middleware
       */
      ENV.container = new Arrow(cfg)

      /**
       * Still we need to start the hhtp server manually
       */
      ENV.container.start(() => {
        ENV.httpStarted = true
        ENV.connector = getConnector(ENV.container, conn)
        callback(ENV)
      })
    }
  }

  /**
   * Asynchronous function.
   * Stops the HTTP server.
   *
   * @param {Function} callback executed after the server has been stoped
   */
  function stopArrowHttp (callback) {
    ENV.container.stop(() => {
      ENV.httpStarted = false
      callback()
    })
  }

  /**
   * Construct Arrow Connector.
   *
   * @param {Object} container Arrow instance
   * @param {Object/String} connector could be connector
   */
  function getConnector (container, connector) {
    if (!connector) {
      throw new Error(`No connector information provided.
                       Please pass either Arrow.Connector instance or the string name of the connector.`)
    }

    if (connector instanceof Arrow.Connector) {
      return connector
    }

    if (typeof connector === 'string') {
      return container.getConnector(connector)
    }

    throw new Error(`Could not construct connector. Please check your Arrow and Connector configuration files.`)
  }

  /**
   * Starts Arrow without initialize express app.
   *
   * @param {Object} cfg Arrow configuration
   */
  function startContainerPlain (cfg) {
    if (ENV.container) {
      return ENV
    }

    ENV.container = new Arrow(cfg, true)
    return ENV
  }
}
