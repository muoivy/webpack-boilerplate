const path = require('path')
const paths = require('./paths');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Look for .html files
const htmlFiles = [];
const directories = ['src'];
while (directories.length > 0) {
  let directory = directories.pop();
  let dirContents = fs.readdirSync(directory)
    .map(file => path.join(directory, file));

  htmlFiles.push(...dirContents.filter(file => file.endsWith('.html')));
  directories.push(...dirContents.filter(file => fs.statSync(file).isDirectory()));
}

module.exports = {
  entry: [paths.src + '/scripts/index.js'],
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    ...htmlFiles.map(htmlFile =>
      new HtmlWebpackPlugin({
        template: htmlFile,
        filename: htmlFile.replace(path.normalize("src/"), ""),
        inject: false
      })
    )
  ],
};
