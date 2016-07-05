'use strict';

const loaders = require('./webpack/loaders');
const webpack = require('webpack');

module.exports = (config) => {
  config.set({
    frameworks: [
      'jasmine',
      'source-map-support',
    ],

    files: ['./src/tests.entry.ts'],

    preprocessors: {
      './src/**/*.ts': [
        'webpack',
        'sourcemap',
      ],
      './src/**/!(*.spec|tests.*).ts': [
        'coverage',
      ],
    },

    webpack: {
      entry: './src/tests.entry.ts',
      devtool: 'inline-source-map',
      verbose: true,
      resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
      },
      module: {
        loaders: [
          loaders.tsTest,
          loaders.html,
          loaders.svg,
          loaders.css,
        ],
        postLoaders: [
          loaders.istanbulInstrumenter,
        ],
      },
      stats: { colors: true, reasons: true },
      debug: true,
      plugins: [new webpack.NoErrorsPlugin()],
    },

    webpackServer: {
      noInfo: true, // prevent console spamming when running in Karma!
    },

    reporters: ['spec', 'coverage'],
    // only output json report to be remapped by remap-istanbul
    coverageReporter: {
      reporters: [
        { type: 'json' },
        { type: 'html' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        {
          type: 'cobertura',
          subdir: '../../../../../../reports/ux',
          file: 'coverage.xml',
        },
      ],
      dir: './coverage/',
      subdir: (browser) => {
        return browser.toLowerCase().split(/[ /-]/)[0]; // returns 'chrome'
      },
    },

    port: 9999,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'], // Alternatively: 'Chrome'
    captureTimeout: 6000,
    singleRun: true,
  });
};
