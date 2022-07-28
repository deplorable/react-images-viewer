const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  context: path.resolve(__dirname, "examples/src"),
  entry: {
    app: "app.js",
    app_CN: "app_CN.js",
    common: ["react-images-viewer"],
  },
  output: {
    path: path.resolve(__dirname, "examples/dist"),
    filename: "[name].js",
    publicPath: "/",
  },
  devtool: "inline-source-map",
  devServer: {
    //contentBase: path.resolve(__dirname, "examples/src"),
    static: [
      {
        directory: path.resolve(__dirname, "examples/dist"),
        watch: true
      }
    ],
    host: "0.0.0.0",
    port: 8001,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          },
        ],
      },
    ],
  },
  resolve: {
    roots: [
      __dirname,
      path.resolve(__dirname, "examples/src"),
      path.resolve(__dirname, "examples/dist"),
    ],
    alias: {
      "react-images-viewer": path.resolve(__dirname, "src/ImgsViewer"),
      "app.js": path.resolve(__dirname, "examples/src/app"),
      "app_CN.js": path.resolve(__dirname, "examples/src/app"),
      "common": path.resolve(__dirname, "examples/dist/common")
    },
    //extensions: ['.js']
  },
  optimization: {
    //chunkIds: 'named',
    splitChunks: {
      //filename: 'common.js',
      // minChunks: 2,
      /*cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          //idHint: "common",
          chunks: "all"
        },
      },*/
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "example.css",
      chunkFilename: "example.css",
      ignoreOrder: false,
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: false,
      template: path.resolve(__dirname, "examples/src/index.html"),
    }),
    new HtmlWebpackPlugin({
      filename: "index_CN.html",
      inject: false,
      template: path.resolve(__dirname, "examples/src/index_CN.html"),
    })
  ],
};
