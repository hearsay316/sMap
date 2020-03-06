// vue.config.js
const UploadSshPlugin = require('./plugins/uploadSshPlugin')
module.exports = {
  //publicPath: process.env.VUE_APP_ENV === 'production' ? 'http://cdn.j6375x.cn/cdn/webgl/' + process.env.VER : '.',
  publicPath:'.',
  // 选项...
  devServer: {
    before(app) {
      app.get("/app/user", (req, res) => {
        res.json([
          {
            id: "hugai",
            class: "2.6"
          }
        ]);
      });
    }
  },
  configureWebpack: config => {
    config.externals = {
      Cesium: "Cesium"
    };
    // if (process.env.VUE_APP_ENV === 'production') {
    //   config.plugins.push(new UploadSshPlugin({
    //     host: process.env.host,
    //     username: process.env.name,
    //     password: process.env.password,
    //     port: process.env.port
    //   }))
    // }
  }
};
