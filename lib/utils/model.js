module.exports = {
  getParentModelName: getParentModelName
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
