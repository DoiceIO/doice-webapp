module.exports = {
  transpileDependencies: [
    'mediasoup-client',
    'fake-mediastreamtrack',
    'awaitqueue',
    'h264-profile-level-id'
  ],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            /node_modules\/mediasoup-client/,
            /node_modules\/fake-mediastreamtrack/,
            /node_modules\/awaitqueue/,
            /node_modules\/h264-profile-level-id/
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@vue/cli-plugin-babel/preset'],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-private-methods'
              ]
            }
          }
        }
      ]
    }
  }
};

