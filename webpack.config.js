let path = require('path');
let webpack = require('webpack');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let nodeExternals = require('webpack-node-externals');

let env = process.env.NODE_ENV || 'dev';
let prod = env === 'production';

let plugins = [
  new ExtractTextPlugin("[name]"),
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8889
  })
];

let config = {
  devtool: prod ? false : 'source-map',
  entry: {
    "index.js":     "./src/arise.js",
    "arise.css":    "./src/arise.scss"
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name]'
  },
  externals: prod ? [ nodeExternals() ] : [],
  plugins: plugins,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: [
            [ 'es2015', { modules: false } ],
            [ "env", {
              "targets" : {
                "browsers" : ["last 3 versions", "ie >= 9"]
              }
            }],
            'react',
            'stage-0'
          ],
          plugins: [
            "transform-export-extensions",
            "add-module-exports",
            [ "module-resolver", {
                "root": ["."],
                "alias": {
                  "react": "preact-compat",
                  "react-dom": "preact-compat"
                }
              }
            ]
          ]
        },
        exclude: path.resolve(__dirname, 'node_modules')
      },
      {
        test: /\.(s)?css$/,
        loader: ExtractTextPlugin.extract({
              fallback: "style-loader",
              loader: "css-loader!resolve-url-loader!sass-loader?sourceMap"
            })
      },
    ]
  }
};

if (prod) {
  Object.assign(config.output, {
    library: 'Arise',
    libraryTarget: 'umd'
  });
} else {
  Object.assign(config.entry, {
    "testing.js":  "./src/testing.js"
  });
}

module.exports = config;
