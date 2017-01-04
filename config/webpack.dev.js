const path            = require('path')
const webpack         = require('webpack')
const pkg             = require('../package.json')

const __INPUT__       = path.join(__dirname, '..', 'example')

module.exports = {

  devtool: 'eval-source-map',

  context: path.join(__dirname),

  contentBase: path.join(__dirname),

  entry: {
    app: [path.join(__INPUT__, 'index.js')]
  },

  output: {
    filename: '[name].js',
    publicPath: '/'
  },

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        plugins: [
          'transform-runtime',
          'transform-decorators-legacy'
        ],
        presets: ['es2015', 'stage-0']
      }
    }]
  },

  devServer: {
    contentBase: __INPUT__,
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8888,
    hot: true,
    quiet: false
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"',
        'THEME': JSON.stringify(process.env.THEME)
      }
    })
  ],

  resolve: {
    extensions: ['', '.js']
  }
}
