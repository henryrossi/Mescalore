const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Mescolare'
    }),
    new webpack.DefinePlugin({
        'process.env.MODE': JSON.stringify(process.env.PRODUCTION),
        'process.env.BACKEND_URI': JSON.stringify(process.env.BACKEND_URI),
    }),
    new MiniCssExtractPlugin(),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        options: {
          modules: true,
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|pdf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};