const path = require('path');
const AddNoopenerPlugin = require('../src/index');

module.exports = {
  mode: 'production',
  entry: './src/index.html',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new AddNoopenerPlugin({
      verbose: true,
      extensions: ['.html']
    })
  ]
};

