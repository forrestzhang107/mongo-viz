let config = {}

function getConfig() {
  return config
}

exports.getConfig = getConfig

function setConfig(obj) {
  config = {...config, ...obj}
}

exports.setConfig = setConfig
