module.exports = {
  modelActions: modelActions
}

function modelActions (model, schema) {
  const availableActions = [
    'create', 'delete', 'findAndModify', 'update', 'deleteAll', 'findAll', 'findByID',
    'findById', 'query', 'count', 'distinct', 'deleteOne'
  ]

  const actions = Object.keys(schema)

  model.disabledActions = availableActions.filter(x => actions.indexOf(x) === -1)
}
