'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const proxy = require('./server/webpack-dev-proxy');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SplitByPathPlugin = require('webpack-split-by-path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const loaders = require('./webpack/loaders');

const basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    __PRODUCTION__: process.env.NODE_ENV === 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  new SplitByPathPlugin([
    { name: 'vendor', path: [__dirname + '/node_modules/'] },
  ]),
  new HtmlWebpackPlugin({
    template: './demo/src/index.html',
    inject: 'body',
    minify: false,
  }),
  new ExtractTextPlugin('css/[name].[hash].css'),
  new CopyWebpackPlugin([
    { from: 'src/app/styles/fonts' },
  ]),
];

const devPlugins = [
  new webpack.NoErrorsPlugin(),
  new StyleLintPlugin({
    configFile: './.stylelintrc',
    files: ['src/**/*.css'],
    failOnError: false,
  }),
];

const prodPlugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    mangle: {
      keep_fnames: true,
    },
    compress: {
      warnings: false,
    },
  }),
  new webpack.NoErrorsPlugin(),
];

const plugins = basePlugins
  .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
  .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);

const postcssBasePlugins = [
  require('postcss-import')({
    addDependencyTo: webpack,
  }),
  require('postcss-cssnext')({
    browsers: ['ie >= 8', 'last 2 versions'],
  }),
];
const postcssDevPlugins = [];
const postcssProdPlugins = [
  require('cssnano')({
    safe: true,
    sourcemap: false,
    autoprefixer: false,
  }),
];

const postcssPlugins = postcssBasePlugins
  .concat(process.env.NODE_ENV === 'production' ? postcssProdPlugins : [])
  .concat(process.env.NODE_ENV === 'development' ? postcssDevPlugins : []);

module.exports = {
  entry: {
    app: './demo/src/main.ts',
  },

  output: {
    path: path.resolve(__dirname),
    filename: '[name].[hash].js',
    publicPath: './',
    sourceMapFilename: '[name].[hash].js.map',
    chunkFilename: '[id].chunk.js',
  },

  devtool: 'eval',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.scss'],
  },

  plugins: plugins,

  devServer: {
    historyApiFallback: { index: '/' },
    proxy: proxy(),
  },

  module: {
    preLoaders: [
      loaders.tslint,
    ],
    loaders: [
      loaders.ts,
      loaders.html,
      loaders.css,
    ],
    noParse: [/zone\.js\/dist\/.+/, /angular2\/bundles\/.+/],
  },

  postcss: () => {
    return postcssPlugins;
  },
};
