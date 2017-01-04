const path                = require('path')
const webpack             = require('webpack')
const pkg                 = require('../package.json')

const __OUTPUT__          = path.join(__dirname, '..', 'dist')
const __INPUT__           = path.join(__dirname, '..')
const __COMPONENT_NAME__  = pkg.name

module.exports = {

  devtool: 'source-map',

  debug: false,

  context: __dirname,

  entry: {
    index: [
      path.join(__INPUT__, 'pre-loader.js'),
    ]
  },

  output: {
    path: __OUTPUT__,
    publicPath: './',
    filename: 'pre-loader.min.js',
    libraryTarget: 'umd',
    library: 'preLoader'
  },

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        plugins: ['transform-runtime', 'transform-decorators-legacy'],
        presets: ['es2015', 'stage-0']
      }
    }]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false, //prod
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      }, //prod
      compress: {
        screw_ie8: true
      }, //prod
      comments: false //prod
    })
  ],

  resolve: {
    extensions: ['', '.js']
  }
}
