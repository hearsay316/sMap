<template>
  <div class="suofeiya">
    <div id="cesiumContainer"></div>
    <div id="toolbar" class="param-container tool-bar">
      <table>
        <tbody>
          <tr>
            <td>亮度</td>
            <td>
              <input
                type="range"
                min="0"
                max="2"
                step="0.02"
                data-bind="value: brightness, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>对比度</td>
            <td>
              <input
                type="range"
                min="0"
                max="2"
                step="0.02"
                data-bind="value: contrast, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>色调</td>
            <td>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.02"
                data-bind="value: hue, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>饱和度</td>
            <td>
              <input
                type="range"
                min="0"
                max="2"
                step="0.02"
                data-bind="value: saturation, valueUpdate: 'input'"
              />
            </td>
          </tr>
          <tr>
            <td>伽马</td>
            <td>
              <input
                type="range"
                min="0"
                max="2"
                step="0.02"
                data-bind="value: gamma, valueUpdate: 'input'"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="loadingbar" ref="loadingbar" class="spinner">
      <div class="spinner-container container1">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
      <div class="spinner-container container2">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
      <div class="spinner-container container3">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { URL_CONFIG } from "../config/UrlConfig";
import Cesium from "Cesium";
let viewer, scene, widget, sceneLayer;
export default {
  name: "suofeiya",
  mounted() {
    this.load();
  },
  methods: {
    load() {
      //初始化viewer部件
      viewer = new Cesium.Viewer("cesiumContainer");
      // viewer.imageryLayers.addImageryProvider(
      //   new Cesium.BingMapsImageryProvider({
      //     url: "https://dev.virtualearth.net",
      //     mapStyle: Cesium.BingMapsStyle.AERIAL,
      //     key: URL_CONFIG.BING_MAP_KEY
      //   })
      // );
      scene = viewer.scene;
      widget = viewer.cesiumWidget;
      sceneLayer;
      try {
        var promise = scene.open(
          "https://www.huaitaos.com:8443/iserver/services/3D-supermap03261643/rest/realspace"
        );
        Cesium.when(
          promise,
          function() {
            var layer = scene.layers.find("Config");
            console.log(layer);
            sceneLayer = layer;
            //设置相机位置，定位至模型
            scene.camera.setView({
              //将经度、纬度、高度的坐标转换为笛卡尔坐标
              destination: Cesium.Cartesian3.fromDegrees(
                102.07069,
                24.97054,
                10.0
              ),
              orientation: {
                heading: Cesium.Math.toRadians(90.0),
                pitch: Cesium.Math.toRadians(-90),
                roll: 0
              }
            });
          },
          function(e) {
            var title = "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
            widget.showErrorPanel(title, undefined, e);
          }
        );
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          var title = "渲染时发生错误，已停止渲染。";
          widget.showErrorPanel(title, undefined, e);
        }
        console.log(e);
      }
      // The viewModel tracks the state of our mini application.
      var viewModel = {
        brightness: 1,
        contrast: 1,
        hue: 0,
        saturation: 1,
        gamma: 1
      };
      // Convert the viewModel members into knockout observables.
      Cesium.knockout.track(viewModel);
      // Bind the viewModel to the DOM elements of the UI that call for it.
      var toolbar = document.getElementById("toolbar");
      Cesium.knockout.applyBindings(viewModel, toolbar);

      // Make the active imagery layer a subscriber of the viewModel.
      function subscribeLayerParameter(name) {
        Cesium.knockout
          .getObservable(viewModel, name)
          .subscribe(function(newValue) {
            var layer = sceneLayer;
            layer[name] = parseFloat(newValue);
            //sceneLayers[0].refresh();
          });
      }
      subscribeLayerParameter("brightness");
      subscribeLayerParameter("contrast");
      subscribeLayerParameter("hue");
      subscribeLayerParameter("saturation");
      subscribeLayerParameter("gamma");
      this.$refs.loadingbar.remove();
    }
  }
};
</script>

<style scoped>
#toolbar input {
  vertical-align: middle;
  padding-top: 2px;
  padding-bottom: 2px;
  margin: 10px 0px;
  width: 150px;
}
</style>
