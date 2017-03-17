/* eslint-env node, es6 */

'use strict';

const
  BASE_NAME = 'anim-event',
  OBJECT_NAME = 'AnimEvent',

  webpack = require('webpack'),
  path = require('path'),
  PKG = require('./package'),

  BUILD = process.env.NODE_ENV === 'production',

  SRC_PATH = path.resolve(__dirname, 'src'),
  ENTRY_PATH = path.resolve(SRC_PATH, `${BASE_NAME}.js`),
  BUILD_PATH = BUILD ? __dirname : path.resolve(__dirname, 'test'),
  BUILD_FILE = `${BASE_NAME}${BUILD ? '.min' : ''}.js`,

  BABEL_RULE = {
    loader: 'babel-loader',
    options: {
      presets: ['es2015'],
      plugins: ['add-module-exports']
    }
  };

module.exports = {
  entry: ENTRY_PATH,
  output: {
    path: BUILD_PATH,
    filename: BUILD_FILE,
    library: OBJECT_NAME,
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          BABEL_RULE,
          BUILD ? {
            loader: 'pre-proc-loader',
            options: {removeTag: {tag: 'DEBUG', pathTest: SRC_PATH}}
          } : null
        ].filter(loader => !!loader)
      }
    ]
  },
  devtool: BUILD ? false : 'source-map',
  plugins: BUILD ? [
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: true}}),
    new webpack.BannerPlugin({raw: true,
      banner: `/*! ${PKG.title || PKG.name} v${PKG.version} (c) ${PKG.author.name} ${PKG.homepage} */`})
  ] : []
};
