//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------

const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SassGlobImporter = require('node-sass-glob-importer');

const mode = process.env.NODE_ENV;

// const isDev = mode === 'development';
// const isNotDev = mode !== 'development';
// const isProd = mode === 'production';
const isNotProd = mode !== 'production';

const paths = {
   build: path.join(__dirname, '/build'),
   clean: [
      path.join(__dirname, '/build/index.html'),
      path.join(__dirname, '/build/index.js'),
   ],
};


//--------------------------------------------------------------------------------------------------
// Application Configuration
//--------------------------------------------------------------------------------------------------

const notProductionPlugins = [
   // Remove app directory
   new CleanWebpackPlugin(paths.clean),

   // Create index page
   new HtmlWebpackPlugin({
      template: 'src/index.pug',
   }),

   // Global modules
   // new webpack.ProvidePlugin(),
];

const ProductionPlugins = [
   // Remove app directory
   new CleanWebpackPlugin(paths.clean),

   // Create index page
   new HtmlWebpackPlugin({
      template: 'src/index.pug',
   }),

   // Extract Css
   new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
   }),

   // Global modules
   // new webpack.ProvidePlugin(),
];


const application = {
   mode: process.env.NODE_ENV,
   target: 'electron-renderer',
   entry: path.join(__dirname, '/src/index.js'),
   node: {
      __dirname: false,
      __filename: false,
   },
   output: {
      filename: 'index.js',
      path: paths.build,
   },
   plugins: isNotProd
      ? notProductionPlugins
      : ProductionPlugins,
   resolve: {
      alias: {
         Components: path.join(__dirname, 'src/local/components/'),
         Localization: path.join(__dirname, 'src/local/localization/'),
         Resources: path.join(__dirname, 'src/local/resources/'),
         Routes: path.join(__dirname, 'src/local/routes/'),
         Styles: path.join(__dirname, 'src/local/styles/'),
      },
   },
   module: {
      rules: [
         {
            test: /\.scss$/,
            use: [
               // Extraction
               // --------------------------------------------------------------
               isNotProd
                  ? {
                     loader: 'style-loader',
                  }
                  : {
                     loader: MiniCssExtractPlugin.loader,
                     options: {
                        publicPath: '../',
                     },
                  },
               // Css loader
               // --------------------------------------------------------------
               {
                  loader: 'css-loader',
                  options: {
                     sourceMap: isNotProd,
                  },
               },
               // Sass transformation
               // --------------------------------------------------------------
               {
                  loader: 'sass-loader',
                  options: {
                     importer: SassGlobImporter(),
                  },
               },
               // --------------------------------------------------------------
            ],
         },

         {
            test: /\.pug$/,
            use: [{ loader: 'pug-loader' }],
         },

         {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     outputPath: 'images',
                  },
               },
            ],
         },
      ],
   },
};


//--------------------------------------------------------------------------------------------------
// ElectronJS Configuration
//--------------------------------------------------------------------------------------------------

const electron = {
   mode: 'production',
   target: 'electron-main',
   entry: path.join(__dirname, '/electron/electron.prod.config.js'),
   node: {
      __dirname: false,
      __filename: false,
   },
   output: {
      filename: 'electron.config.js',
      path: paths.build,
   },
};


//--------------------------------------------------------------------------------------------------
// Export
//--------------------------------------------------------------------------------------------------

const notProductionExport = [
   application,
];

const ProductionExport = [
   electron,
   application,
];

module.exports = isNotProd
   ? notProductionExport
   : ProductionExport;
