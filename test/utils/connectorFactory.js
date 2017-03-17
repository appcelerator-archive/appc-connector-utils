const Arrow = require('arrow')
const DEFULT_CONNECTOR_CONFIG = require('../conf/connector')
const DEFAULT_CONNECTOR_NAME = 'appc.test'
const DEFAULT_CONNECTOR_METADATA = {
  name: DEFAULT_CONNECTOR_NAME,
  connect: function () { },
  create: function (Model, value, callback) { }
}
module.exports = (metadata, cfg) => {
  const Connector = Arrow.Connector.extend(metadata || DEFAULT_CONNECTOR_METADATA)
  return new Connector(cfg || DEFULT_CONNECTOR_CONFIG)
}
