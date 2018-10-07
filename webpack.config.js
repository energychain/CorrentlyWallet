var path = require('path');

module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'correntlywallet.js',
    path: path.resolve(__dirname, 'dist/')
  }
};
