/* eslint-env node, es6 */

'use strict';

const webpack = require('webpack'),
  buildMode = require('yargs').argv.mode === 'build',
  PKG = require('./package');

module.exports = {
  entry: './anim-event.js',
  output: {
    path: buildMode ? __dirname : require('path').join(__dirname, 'test'),
    filename: buildMode ? 'anim-event.min.js' : 'anim-event.js',
    library: 'AnimEvent',
    libraryTarget: 'var'
  },
  plugins: buildMode ? [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin(
      `/*! ${PKG.title || PKG.name} v${PKG.version} (c) ${PKG.author.name} ${PKG.homepage} */`,
      {raw: true})
  ] : null
};
