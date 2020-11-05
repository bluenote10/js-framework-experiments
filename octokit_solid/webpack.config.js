const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/main.tsx'
  },
  devtool : 'source-map',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
        },
      },
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
    alias: {
      // Currently it is not possible to import echarts from the "lib" folder
      // and set the language: https://github.com/apache/incubator-echarts/issues/7451
      // As a temporary work-around we import it from the "dist" folder instead,
      // which has pre-bundled English versions.
      echarts$: path.resolve(__dirname, 'node_modules/echarts/dist/echarts-en.min.js'),
    },
  },
  plugins: [
    // https://webpack.js.org/plugins/define-plugin/#usage
    new webpack.DefinePlugin({
      'process.env.AUTH': JSON.stringify(process.env.AUTH),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
  }
};
