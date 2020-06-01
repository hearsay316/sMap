import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./plugins/element.js";

Vue.config.productionTip = false;
import superMap from "./packages/index";
Vue.use(superMap, {
  path: [
    "https://cdn.j6375x.cn/cdn/superMap/examples/css/sideBar.css",
    "https://cdn.j6375x.cn/cdn/superMap//examples/js/plotPanelControl/colorpicker/css/colorpicker.css",
    "https://at.alicdn.com/t/font_1711360_ju54515e55a.css",
    "https://cdn.j6375x.cn/cdn/superMap/examples/css/pretty.css",
    "https://cdn.j6375x.cn/cdn/superMap/Build/Cesium/Widgets/widgets.css",
    "https://cdn.j6375x.cn/cdn/superMap/Build/Cesium/Cesium.js",
    "https://cdn.j6375x.cn/cdn/superMap/Build/Cesium/ThirdParty/Workers/PlotAlgo/PlotAlgoInclude.js"
  ],
  plotBasePath: [
    "colorpicker/css/colorpicker.css",
    "colorpicker/css/layout.css",
    "jquery-easyui-1.4.4/css/easyui.css",
    "zTree/css/zTreeStyle.css",
    "jquery-easyui-1.4.4/jquery.min.js",
    "jquery-easyui-1.4.4/jquery-ui.js",
    "jquery-easyui-1.4.4/jquery.easyui.min.js",
    "colorpicker/js/colorpicker.js",
    "colorpicker/js/colorpickerEditor.js",
    "colorpicker/js/eye.js",
    "colorpicker/js/utils.js",
    "colorpicker/js/layout.js",
    "zTree/jquery.ztree.core.js",
    "./StylePanel.js",
    "./PlotPanel.js"
  ]
});
console.log("main.js开始");
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
