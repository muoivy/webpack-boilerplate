const path = require('path')
const paths = require('./paths');
const fs = require('fs');
const globule = require('globule');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Look for .pug files
const pugFiles = globule.find('./src/html/page/**/*.pug', {
  ignore: [ './src/html/components/**/*','./src/html.layouts/**/*' ]
});

const buildDefault = {
  entry: [paths.src + '/scripts/index.js'],
  output: {
    path: paths.build,
    filename: 'assets/js/[name].bundle.js',
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true
            }
          }
        ]
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "assets/css/[name].css",
    }),
  ],
};


pugFiles.forEach((pug) => {
  // const html = pug.split('/').slice(-1)[0].replace('.pug', '.html');
  const html = pug.replace('./src/html/page/', '').replace('.pug', '.html')
  buildDefault.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${path.resolve(__dirname, '../dist')}/${html}`,
      inject:'body',
      template: pug,
      minify: false
    })
  )
});

module.exports = buildDefault;