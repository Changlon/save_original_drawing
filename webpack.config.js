const path = require('path') 

module.exports = {
  entry: {
      app:"./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, 'target'),
    filename: '[name].js',
  },
  target:"node"
}