/* eslint-env node, es6 */

'use strict';

const
  path = require('path'),
  SRC_PATH = path.resolve(__dirname, 'src'),
  BUILD = process.env.NODE_ENV === 'production',
  BABEL_RULE = {
    loader: 'babel-loader',
    options: {
      presets: ['es2015'],
      plugins: ['add-module-exports']
    }
  },

  BASE_NAME = 'anim-event',
  OWN_PATH = path.resolve(SRC_PATH, `${BASE_NAME}.js`);

module.exports = [
  {
    resource: {and: [SRC_PATH, /\.js$/]},
    use: [
      BABEL_RULE,
      BUILD ? {
        loader: 'pre-proc-loader',
        options: {
          removeTag: {tag: 'DEBUG'}
        }
      } : {
        loader: 'skeleton-loader',
        options: {
          procedure: function(content) {
            const preProc = require('pre-proc');
            if (this.resourcePath === OWN_PATH && this.options.entry === OWN_PATH) {
              // Save the source code after preProc has been applied.
              const destPath = path.resolve(SRC_PATH, `${BASE_NAME}.proc.js`);
              require('fs').writeFileSync(destPath,
                '/*\n    DON\'T MANUALLY EDIT THIS FILE\n*/\n\n' +
                preProc.removeTag('DEBUG', content));
              console.log(`Output: ${destPath}`);
            }
            return content;
          }
        }
      }
    ]
  }
];
