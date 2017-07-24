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
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader?sourceMap',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              localIdentName: '[local]__[hash:base64:5]',
              modules: true,
              sourceMap: true
            }
          },
          'postcss-loader?sourceMap',
          'sass-loader?sourceMap'
        ]
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  }
};
