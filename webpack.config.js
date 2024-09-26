const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts", // 진입점 설정
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "node", // Node.js 환경을 대상으로 설정
  mode: "production", // 필요에 따라 'development'로 변경
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            allowTsInNodeModules: true, // node_modules 내의 TS 파일 처리 허용
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@common": path.resolve("./src/common/"),
      "@module": path.resolve("./src/module/"),
      "@src": path.resolve("./src/"),
    },
    extensions: [".ts", ".js"],
    fallback: {
      fs: false,
      net: false,
      tls: false,
      tty: false,
      path: false,
    },
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /@inquirer[\/\\]prompts/,
      path.resolve(__dirname, "node_modules/@inquirer/prompts"),
      {
        "./": "@inquirer/prompts",
      }
    ),
  ],
};
