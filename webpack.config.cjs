const path = require("path");

module.exports = {
  entry: "./js/script.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader", // Injeta o CSS no DOM
          "css-loader", // Lê o CSS
          "lightningcss-loader",
        ],
      },
    ],
  },
};
