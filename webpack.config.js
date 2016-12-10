'use strict';

const webpack = require('webpack'),
  path = require('path'),
  buildMode = require('yargs').argv.mode === 'build',
  PKG = require('./package'),

  BABEL_TARGET_PACKAGES = [
  ].map(packageName => path.resolve(__dirname, `node_modules/${packageName}`) + path.sep);

module.exports = {
  entry: './src/anim-event.js',
  output: {
    path: buildMode ? __dirname : path.join(__dirname, 'test'),
    filename: buildMode ? 'anim-event.min.js' : 'anim-event.js',
    library: 'AnimEvent',
    libraryTarget: 'var'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: absPath =>
          !BABEL_TARGET_PACKAGES.find(target => absPath.indexOf(target) === 0) &&
          absPath.split(path.sep).includes('node_modules'),
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['add-module-exports']
        }
      }
    ]
  },
  devtool: buildMode ? null : 'source-map',
  plugins: buildMode ? [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin(
      `/*! ${PKG.title || PKG.name} v${PKG.version} (c) ${PKG.author.name} ${PKG.homepage} */`,
      {raw: true})
  ] : null
};
