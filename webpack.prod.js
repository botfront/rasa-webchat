const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: 'react-chat-widget',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.scss$/,
      use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [
              path.resolve(__dirname, 'src/sass/')
            ]
          }
        }
      ]
    }, {
      test: /\.(jpg|png|gif|svg)$/,
      use: {
        loader: 'url-loader'
      }
    }]
  }
};
