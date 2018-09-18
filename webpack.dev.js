const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    library: 'WebChat',
    libraryTarget: 'umd'
  },
  devServer: {
    stats: 'errors-only',
    host: process.env.HOST, // Defaults to `localhost`
    port: process.env.PORT, // Defaults to 8080
    open: true, // Open the page in browser
    contentBase: path.resolve(__dirname, 'lib')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'), // eslint-disable-line
              autoprefixer({
                browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie <9'],
                flexbox: 'no-2009'
              })
            ]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [path.resolve(__dirname, 'src/scss/')]
          }
        }
      ]
    }, {
      test: /\.(jpg|png|gif|svg)$/,
      use: {
        loader: 'url-loader'
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['lib']),
    new HtmlWebpackPlugin({
      title: 'Web Chat Widget Test',
      filename: 'index.html',
      inject: false,
      template: 'dev/src/index.html',
      showErrors: true
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFileName: '[id].css'
    })
  ]
};
