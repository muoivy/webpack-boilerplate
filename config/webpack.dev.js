const paths = require('./paths');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: 'local-ipv4',
    port: 8080,
    // static: {
    //   directory: paths.build,
    //   watch: true,
    // },
  },
});