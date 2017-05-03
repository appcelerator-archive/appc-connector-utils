const os = require('os')
const fs = require('fs')
const path = require('path')

module.exports = {
  createDir: createDir,
  cleanDir: cleanDir,
  saveModelSync: saveModelSync
}

function createDir (connectorName) {
  const dir = path.join(os.tmpdir(), connectorName)
  ensureExistsAndClean(dir)
  return dir
};

function cleanDir (dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  const content = fs.readdirSync(dir)
  for (var i = 0; i < content.length; i++) {
    const fileName = content[i]
    if (fileName.slice(-3) === '.js') {
      fs.unlinkSync(path.join(dir, fileName))
    }
  }
}

/**
 * Saves model to disk
 *
 * @param {string} modelName the name model
 * @param {object} modelMetadata metadata that describes the model
 * @param {string} modelDir the directory where to save the model
 */
function saveModelSync (modelName, modelMetadata, modelDir) {
  const buffer = `const Arrow = require('arrow')
var Model = Arrow.Model.extend('${modelName}', ${JSON.stringify(modelMetadata, null, '\t')})
module.exports = Model`
  fs.writeFileSync(path.join(modelDir, modelMetadata.name.toLowerCase() + '.js'), buffer)
}

/**
 * Makes sure that the specified directory exists.
 * @param dir
 */
function ensureExistsAndClean (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  } else {
    cleanDir(dir)
  }
}
