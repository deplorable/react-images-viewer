const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  context: path.resolve(__dirname, "examples/src"),
  entry: {
    app: "./app.js",
    app_CN: "./app_CN.js",
    common: "./common.js" //["react-images-viewer"]
  },
  output: {
    path: path.resolve(__dirname, "examples/dist"),
    filename: "[name].js",
    publicPath: "/",
  },
  devtool: "inline-source-map",
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, "examples/src"),
        watch: true
      },
    ],
    host: "0.0.0.0",
    port: 8002,
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", 
        { loader: "less-loader", options: {
            implementation: require("less"),
        }}],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: { presets: ["@babel/preset-react", "@babel/preset-env"] },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.wasm', '.mjs', '.css', '.less'],
    alias: {
      "react-images-viewer": path.resolve(__dirname, "src/ImgsViewer")
    },
  },
  optimization: {
    chunkIds: 'named',
    splitChunks: {
      //chunks: "all",
      //name: "common",
      //filename: 'common.js'
      //minChunks: 2,
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all"
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      //inject: false,
      template: path.resolve(__dirname, "examples/src/index.html"),
      publicPath: "/"
    }),
    new HtmlWebpackPlugin({
      filename: "index_CN.html",
      //inject: false,
      template: path.resolve(__dirname, "examples/src/index_CN.html"),
      publicPath: "/"
    }),
    new MiniCssExtractPlugin({
      runtime: true,
      filename: "example.css",
      chunkFilename: "example.css",
      ignoreOrder: false,
    })
  ],
};
