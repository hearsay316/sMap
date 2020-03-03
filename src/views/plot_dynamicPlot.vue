<template>
  <div class="plot_dynamicPlot">
    <div
      id="toolbar"
      class="panel panel-primary"
      style="position: absolute;top: 10px;right: 5px; height:100px; border-width: 1px;border-radius: 4px;z-index: 9999"
    >
      <div class="panel-heading">
        <h5 class="panel-title text-center">点线面绘制</h5>
      </div>
      <div class="panel-body content">
        <input
          type="button"
          class="btn btn-default"
          value="绘点"
          onclick="draw_dot()"
        />
        <input
          type="button"
          class="btn btn-default"
          value="绘线"
          onclick="draw_line()"
        />
        <input
          type="button"
          class="btn btn-default"
          value="绘面"
          onclick="draw_polygon()"
        />
        <input
          type="button"
          class="btn btn-default"
          value="绘文字"
          @click="draw_text"
        />
        <input
          type="button"
          class="btn btn-default"
          value="清除"
          @click="clearLayers"
        />
      </div>
    </div>
    <div
      class="sandcastle-loading"
      data-sandcastle-bucket="bucket-requirejs.html"
      style="margin: 0px; overflow: hidden;background: #fff;height: 100%;"
    >
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
              id="stylePanel"
              title="属性面板"
              style="overflow: hidden;"
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
  </div>
</template>

<script>
import Cesium from "Cesium";

console.log(scene);
var cesium, scene, viewer, serverUrl, plotting;
var plottingLayer;
var plotEditControl;
cesium = Cesium;
export default {
  name: "plot_dynamicPlot",
  data() {
    return {};
  },
  mounted() {
    setTimeout(() => {
      this.load();
    }, 2000);
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
    load() {
      //若本地没有标绘相关服务则可访问支持中心的iserver
      // var host = document.location.toString().match('/file:\/\//') ? 'http://localhost:8090' : 'http://' + document.location.host;
      var host = "http://support.supermap.com.cn:8090";
      viewer = new Cesium.Viewer("cesiumContainer");
      scene = viewer.scene;
      //globe : Globe 获取地球对象。
      scene.globe.depthTestAgainstTerrain = false;
      serverUrl =
        "http://support.supermap.com.cn:8090/iserver/services/plot-jingyong/rest/plot/";
      InitPlot(viewer, serverUrl);

      function InitPlot(viewer, serverUrl) {
        if (!viewer) {
          return;
        }
        console.log(scene);
        plottingLayer = new Cesium.PlottingLayer(viewer.scene, "plottingLayer");
        scene.layers.add(plottingLayer);

        // plotEditControl = new cesium.PlotEditControl(viewer.scene, plottingLayer); //编辑控件
        // plotEditControl.activate();

        plotting = cesium.Plotting.getInstance(serverUrl, viewer.scene);

        //  stylePanel = new StylePanel("stylePanel", plotEditControl, plotting);
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

.panel {
    height: 100%;
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
