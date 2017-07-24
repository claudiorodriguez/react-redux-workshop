import path from 'path';

export default {
  devServer: {
    contentBase: [
      'demo/'
    ],
    host: '0.0.0.0',
    inline: true,
    publicPath: '/dist/',
    watchContentBase: true
  },
  entry: {
    index: './src/index.js'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  }
};
