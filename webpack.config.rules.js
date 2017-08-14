/* eslint-env node, es6 */

'use strict';

const
  SRC_PATH = require('path').resolve(__dirname, 'src'),
  BUILD = process.env.NODE_ENV === 'production',
  BABEL_RULE = {
    loader: 'babel-loader',
    options: {
      presets: ['es2015'],
      plugins: ['add-module-exports']
    }
  };

module.exports = [
  {
    resource: {and: [SRC_PATH, /\.js$/]},
    use: [
      BABEL_RULE,
      BUILD ? {
        loader: 'pre-proc-loader',
        options: {removeTag: {tag: 'DEBUG'}}
      } : null
    ].filter(loader => !!loader)
  }
];
