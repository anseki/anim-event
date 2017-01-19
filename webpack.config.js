/* eslint-env node, es6 */

'use strict';

const webpack = require('webpack'),
  path = require('path'),
  BUILD = process.env.NODE_ENV === 'production',
  PKG = require('./package'),

  BABEL_TARGET_PACKAGES = [
  ].map(packageName => path.resolve(__dirname, `node_modules/${packageName}`) + path.sep),

  BABEL_PARAMS = {
    presets: ['es2015'],
    plugins: ['add-module-exports']
  };

module.exports = {
  entry: './src/anim-event.js',
  output: {
    path: BUILD ? __dirname : path.join(__dirname, 'test'),
    filename: BUILD ? 'anim-event.min.js' : 'anim-event.js',
    library: 'AnimEvent',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: absPath => !BABEL_TARGET_PACKAGES.find(target => absPath.indexOf(target) === 0) &&
          absPath.split(path.sep).includes('node_modules'),
        use: [{
          loader: 'babel-loader',
          options: BABEL_PARAMS
        }]
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
