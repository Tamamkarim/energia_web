// This file disables source map warnings for source-map-loader in Create React App (react-scripts)
// Place this file in the root of your frontend directory

module.exports = function override(config, env) {
  // Suppress DOMPurify source map warnings
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    {
      module: /node_modules[\\/]dompurify/,
      message: /Failed to parse source map/,
    },
  ];
  return config;
};
