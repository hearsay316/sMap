// vue.config.js
module.exports = {
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
  }
};
