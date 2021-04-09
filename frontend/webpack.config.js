const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackRules = require('./webpackRules');
const Dotenv = require('dotenv-webpack');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

module.exports = {
  entry: './src/index.tsx',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [...webpackRules],
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new Dotenv(),
  ],
};
