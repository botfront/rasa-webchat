const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { version } = require('./package.json');

module.exports = {
  // entry: ['babel-polyfill', './index.js'],
  entry: './umd.js',
  output: {
    path: path.join(__dirname, '/lib'),
    filename: 'index.js',
    library: 'WebChat',
    libraryTarget: 'umd'
  },
  devServer: {
    stats: 'errors-only',
    host: process.env.HOST, // Defaults to `localhost`
    port: process.env.PORT, // Defaults to 8080
    open: true, // Open the page in browser
    contentBase: path.resolve(__dirname, '/lib')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'string-replace-loader',
          options: {
            search: 'PACKAGE_VERSION_TO_BE_REPLACED',
            replace: version
          }
        },
        { loader: 'babel-loader' }
      ]
    }, {
      test: /\.scss$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [path.resolve(__dirname, 'src/scss/')]
          }
        }
      ]
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(jpg|png|gif|svg|woff|ttf|eot)$/,
      use: {
        loader: 'url-loader'
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Web Chat Widget Test',
      filename: 'index.html',
      inject: false,
      template: 'dev/src/index.html',
      showErrors: true
    })
  ]
};
