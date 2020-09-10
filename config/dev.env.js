var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT:'"http://39.98.120.148:8180/api/"'
  // API_ROOT: '"http://192.168.0.102:8080/api/"'
  API_ROOT:'"http://154.8.204.240:9088/api/"'
})
