'use strict';

let ExtractTextPlugin = require('extract-text-webpack-plugin');
ExtractTextPlugin = new ExtractTextPlugin('css/[name].[hash].css');

exports.tslint = {
  test: /\.ts$/,
  loader: 'tslint',
  exclude: /node_modules/,
};

exports.tsTest = loadTs('ts', true);
exports.istanbulInstrumenter = loadTs('istanbul-instrumenter');
exports.ts = loadTs();

function loadTs(loader, inTest) {
  return {
    test: /\.ts$/,
    loader: loader || 'ts',
    exclude: inTest ? /node_modules/ :
      /(node_modules\/|\.test\.ts$|tests\.\w+\.ts$)/,
  };
}

exports.html = {
  test: /\.html$/,
  loader: 'raw',
  exclude: /node_modules/,
};

exports.css = {
  test: /\.css$/,
  loader: 'to-string!css?-minimize!postcss',
  exclude: /node_modules/,
};
