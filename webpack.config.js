const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

function generateHtmlPlugins (templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      minify: false
    })
  })
}
const htmlPlugins = generateHtmlPlugins('./src/html/page')

const devConfig = {
  entry: {
    app: './src/script/main.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: 8080
  },
  output: {
    filename: 'assets/[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader:'url-loader',
            options:{
                name:'images/[name].[ext]',
                limit:20000,
                publicPath:'../'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      { from: path.resolve(__dirname, './public'), to: path.resolve(__dirname, './dist') }
    ]),
    new webpack.DefinePlugin({
      'process.env.IMAGE_PATH': JSON.stringify(process.env.IMAGE_PATH)
    })
  ].concat(htmlPlugins)
}

const prodConfig = {
  entry: {
    app: './src/script/main.js'
  },
  output: {
    filename: 'assets/[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: process.env.PUBLIC_PATH || '/',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: process.env.PUBLIC_PATH || '/',
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          // Translates CSS into CommonJS
          'css-loader',
          // postcss
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require('autoprefixer')({
                  'overrideBrowserslist': ['> 1%', 'last 2 versions']
              })]
            }
          },
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader:'url-loader',
            options:{
                name:'images/[name].[ext]',
                limit:20000,
                publicPath:'../'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name:'assets/fonts/[name].[ext]',
              limit:20000
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: path.resolve(__dirname, './public'), to: path.resolve(__dirname, './dist') }
    ]),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css',
      chunkFilename: 'assets/[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env.IMAGE_PATH': JSON.stringify(process.env.IMAGE_PATH)
    })
  ].concat(htmlPlugins),
  optimization: {
    splitChunks: {
      chunks: 'async'
    }
  }
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    return devConfig
  }
  if (argv.mode === 'production') {
    return prodConfig
  }
};
