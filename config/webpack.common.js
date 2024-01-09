const path = require('path');
const paths = require('./paths');
const PugPlugin = require('pug-plugin');
const glob = require('glob');

module.exports = {
  entry: getEntryPoints(),

  output: {
    path: paths.build,
    publicPath: '/',
    clean: true,
  },

  devServer: {
    static: {
      directory: paths.build,
    },
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },

  resolve: {
    alias: {
      // use alias to avoid relative paths like `./../../images/`
      Images: path.join(__dirname, '../src/images/'),
      Fonts: path.join(__dirname, '../src/fonts/'),
      Styles: path.join(__dirname, '../src/styles/'),
      Scripts: path.join(__dirname, '../src/scripts/')
    },
    extensions: ['.tsx', '.ts', '.js'],
  },

  plugins: [
    new PugPlugin({
      pretty: true, // formatting HTML, useful for development mode
      js: {
        // output filename of extracted JS file from source script
        filename: 'assets/js/[name].[contenthash:8].js',
      },
      css: {
        // output filename of extracted CSS file from source style
        filename: 'assets/css/[name].[contenthash:8].css',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        oneOf: [
          // import Pug in JavaScript/TypeScript as template function
          {
            issuer: /\.(js|ts)$/,
            loader: PugPlugin.loader,
            options: {
              method: 'compile',
            },
          },
          // render Pug from Webpack entry into static HTML
          {
            loader: PugPlugin.loader,
          },
        ],
        // loader: PugPlugin.loader, // Pug loader
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          // output filename of images
          // filename: 'assets/img/[name][ext][query]',
          filename: (pathData) => {
            const { dir } = path.parse(pathData.filename); // get relative path started with `src/...`
            const outputPath = dir.replace('src/images', 'assets/img'); // remove the source dir from path
            return outputPath + '/[name][ext]'; // return output path with resource filename
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        generator: {
          // output filename of fonts
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
};

function getEntryPoints() {
  const entryPoints = {};
  const files = glob.sync('./src/html/pages/**/*.pug'); // Adjust the glob pattern to include subfolders

  files.forEach(file => {
    const entryName = path.relative('./src/html/pages', file).replace(/\.[^/.]+$/, ''); // Adjust as needed
    entryPoints[entryName] = file;
  });

  return entryPoints;
}
