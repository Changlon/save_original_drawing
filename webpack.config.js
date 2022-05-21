const path = require('path') 

module.exports = {
  entry: {
      app:"./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, 'target'),
    filename: '[name].js',
  },
  target:"node",
  module:{
    rules:[
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use:[{
          loader: "file-loader",
          options:{
            esModule:true,
            outputPath:"assets",
            name:"[name].[ext]"
          }
        }]
      }
    ]
  }
}