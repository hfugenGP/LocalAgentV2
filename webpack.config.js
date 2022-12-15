const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Dotenv = require('dotenv-webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const { resolve } = require('path')
const path = require('path')

module.exports = [
  {
    mode: 'development',
    entry: {
      electron: './src/electron.ts',
      preload: './src/preload.ts',
    },
    target: 'electron-main',
    node: {
      __dirname: false, // this makes all the difference
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }],
        },
        {
          test: /\.(m?js|node)$/,
          parser: { amd: false },
          use: {
            loader: '@vercel/webpack-asset-relocator-loader',
            options: {
              outputAssetBase: 'native_modules',
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.node'],
      alias: {
        '@utils': resolve('src/utils'),
        '@node-firebird': resolve(
          path.join(__dirname, 'node_modules/node-firebird'),
        ),
        '@model': resolve('src/model'),
        '@winax': resolve(path.join(__dirname, 'node_modules/winax')),
        '@hummus': resolve(path.join(__dirname, 'node_modules/hummus')),
        '@pdf2json': resolve(path.join(__dirname, 'node_modules/pdf2json')),
        '@uuidv4': resolve(path.join(__dirname, 'node_modules/uuidv4')),
      },
    },
    output: {
      path: __dirname + '/dist',
      filename: '[name].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](hummus|pdf2json)/,
            priority: 20,
            // 表示是否使用已有的 chunk,如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的
            // Is whether to use the existing chunk. If it is true, it means that if the module contained in the current chunk has been extracted, the new chunk will not be rebuilt
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
  {
    mode: 'development',
    entry: ['./src/index.tsx', './src/styles/main.scss'],
    target: 'web',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }],
        },
        {
          test: /\.s[ca]ss$/i,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
              },
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    output: {
      path: __dirname + '/dist',
      filename: 'react.js',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', 'scss', 'sass'],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './src/template/index.html',
        title: 'Local Agent V2',
        inject: 'body',
      }),
      new Dotenv(),
      new WebpackObfuscator(
        {
          rotateStringArray: true,
        },
        [],
      ),
    ],
  },
]
