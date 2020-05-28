<template>
  <div class="plot_dynamicPlot">
    <div
      id="menu"
      style="position: absolute;width: 250px;height: 100%;border: 1px solid #3473b7;z-index: 98;"
    >
      <div
        class="easyui-panel"
        style="position:absolute;top:0px;bottom:0px;left:0px;right:0px;padding:5px; width: 100%;height: 100%"
      >
        <div class="easyui-tabs" style="width: 100%;height: 100%">
          <div
            id="plotPanel"
            title="标绘面板"
            style="  height: 100%;overflow: hidden;"
          ></div>
          <div
            id="stylePanel"
            title="属性面板"
            style="width: 290px;overflow: hidden"
          ></div>
        </div>
      </div>
    </div>

    <div
      id="cesiumContainer"
      class="fullSize"
      style="position: relative;left: 250px;height: 100%;border: 1px solid #3473b7;"
    ></div>
  </div>
</template>

<script>
import Cesium from "Cesium";

var cesium, viewer, serverUrl, plotting;
var plottingLayer;
var plotDrawControl;
var stylePanel;
var plotEditControl;
window.plotEditControl = plotEditControl;
cesium = Cesium;
export default {
  name: "plot_dynamicPlot",
  data() {
    return {};
  },
  mounted() {
    console.log();
    this.loader();
  },
  methods: {
    draw_text() {
      // plottingLayer.removeAll();
      console.log(plottingLayer);
      var point = [
        new cesium.PlotPoint3D(91.2289399584463, 44.2810161553334, 0)
      ];
      plottingLayer.createSymbol(0, 34, point, function(even) {
        var geo = even.feature;
        geo.textContent = "Supermap";
        geo.symbolTextStyle.foreColor = new cesium.Color(1, 0, 0, 1);
        geo.symbolTextStyle.fontSize = 50;
        geo.symbolTextStyle.fontName = "Times New Roman";
      });
    },
    clearLayers() {
      plottingLayer.removeAll();
    },
    loader() {
      //若本地没有标绘相关服务则可访问支持中心的iserver
      // var host = document.location.toString().match('/file:\/\//') ? 'http://localhost:8090' : 'http://' + document.location.host;
      var host = "http://support.supermap.com.cn:8090";
      viewer = new Cesium.Viewer("cesiumContainer");
      window.scene = viewer.scene;
      //globe : Globe 获取地球对象。
      window.scene.globe.depthTestAgainstTerrain = false;
      serverUrl =
        "https://47.103.125.18:8443/iserver/services/plot-JY/rest/plot";
      InitPlot(viewer, serverUrl);
      try {
        //添加S3M图层服务
        var promise = scene.open(
          "https://47.103.125.18:8443/iserver/services/3D-supermap03261643/rest/realspace"
        );
        Cesium.when(
          promise,
          function(layers) {
            if (!scene.pickPositionSupported) {
              alert("不支持深度拾取,属性查询功能无法使用！");
            }
            layer = scene.layers.find("Config");
            //设置属性查询参数
            layer.setQueryParameter({
              url:
                "https://47.103.125.18:8443/iserver/services/data-userMap/rest/data",
              dataSourceName: "testMap",
              dataSetName: "New_Region",
              keyWord: "SmID"
            });
            //设置相机视角
            scene.camera.setView({
              destination: new Cesium.Cartesian3(
                -20183889.354184173,
                22645826.766457584,
                3223367.6070640916
              ),
              orientation: {
                heading: 5.662887035643514,
                pitch: -1.4213836938199456,
                roll: 9.769962616701378e-14
              }
            });
          },
          function(e) {
            if (widget._showRenderLoopErrors) {
              var title = "渲染时发生错误，已停止渲染。";
              widget.showErrorPanel(title, undefined, e);
            }
          }
        );
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          var title = "渲染时发生错误，已停止渲染.";
          widget.showErrorPanel(title, undefined, e);
        }
      }

      function InitPlot(viewer, serverUrl) {
        if (!viewer) {
          return;
        }
        plottingLayer = new cesium.PlottingLayer(scene, "plottingLayer");
        scene.layers.add(plottingLayer);

        plotEditControl = new cesium.PlotEditControl(
          window.scene,
          plottingLayer
        ); //编辑控件
        plotDrawControl = new cesium.PlotDrawControl(
          window.scene,
          plottingLayer
        ); //绘制控件
        plotDrawControl.drawFinishEvent.addEventListener(function() {
          //标绘结束，激活编辑控件
          plotEditControl.activate();
        });

        plotting = cesium.Plotting.getInstance(serverUrl, scene);
        //标绘面板
        initPlotPanel(
          "plotPanel",
          serverUrl,
          plotDrawControl,
          plotEditControl,
          plotting
        );
        stylePanel = new StylePanel("stylePanel", plotEditControl, plotting);
      }

      function draw_dot() {
        plottingLayer.removeAll();
        var point = [
          new cesium.PlotPoint3D(91.2289399584463, 44.2810161553334, 0)
        ];
        plottingLayer.createSymbol(421, 30502, point);
      }

      function draw_line() {
        plottingLayer.removeAll();
        var points = [];
        points[0] = new cesium.PlotPoint3D(
          79.6055940054417,
          33.8928629711926,
          0
        );
        points[1] = new cesium.PlotPoint3D(
          90.3419566246079,
          54.4258592161011,
          0
        );
        points[2] = new cesium.PlotPoint3D(
          99.9884446983602,
          33.3627305537104,
          0
        );
        points[3] = new cesium.PlotPoint3D(
          112.3419566246079,
          54.1258592161011,
          0
        );
        //创建标号
        plottingLayer.createSymbol(0, 24, points);
      }

      function draw_polygon() {
        plottingLayer.removeAll();
        var points = [];
        points[0] = new cesium.PlotPoint3D(
          75.3616029975312,
          48.7966690280813,
          0
        );
        points[1] = new cesium.PlotPoint3D(
          81.432156521036,
          35.6457727434013,
          0
        );
        points[2] = new cesium.PlotPoint3D(
          102.429727232917,
          36.6596802340062,
          0
        );
        points[3] = new cesium.PlotPoint3D(
          114.503081229812,
          50.7762562321923,
          0
        );
        plottingLayer.createSymbol(0, 32, points);
      }

      //删除指定标号
      function deleteSeleGeo() {
        plottingLayer.removeGeoGraphicObject(plottingLayer.selectedFeature);
      }

      // //“Delete”按键删除选中标号
      // $(document).keydown(function(event) {
      //   if (event.keyCode === 46) {
      //     deleteSeleGeo();
      //   }
      // });
    }
  }
};
</script>

<style scoped lang="stylus">
.plot_dynamicPlot {
    width: 100%
    height: 100%
    overflow hidden
}

.easyui-panel,#plotPanel{
  box-sizing border-box
}
.panel {
    height: 100%;
}

#menu {
    overflow hidden
}

/*下拉框的高度*/
.combo-p {
    height: 150px;
}

/*滚动条*/
.propertygrid {
    overflow: auto;
}
</style>
