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
        <button
          @click="distance"
          type="button"
          id="distance"
          class="button black"
        >
          测距
        </button>
        <button type="button" @click="area" id="area" class="button black">
          测面
        </button>
        <button type="button" @click="height" id="height" class="button black">
          测高
        </button>
        <button type="button" @click="clear" id="clear" class="button black">
          清除
        </button>
        <input
          type="button"
          class="btn btn-default"
          value="绘点"
          @click="draw_dot"
        />
        <input
          type="button"
          class="btn btn-default"
          value="绘线"
          @click="draw_line"
        />
        <input
          type="button"
          class="btn btn-default"
          value="绘面"
          @click="draw_polygon"
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
        id="CesiumContainer"
        class="fullSize"
        style="position: relative;left: 250px;height: 100%;border: 1px solid #3473b7;"
      ></div>
    </div>
    <div id="wrapper" style="display:none">
      <div id="login" class="animate form">
        <span class="close" aria-hidden="true">×</span>
        <form>
          <h1 class="title">模型库</h1>
          <p id="icons"></p>
          <h1>模型属性编辑</h1>

          <div>
            <label>绕X轴旋转</label
            ><input
              id="pitch"
              type="range"
              min="0"
              max="360"
              step="1.0"
              title="pitch"
              data-bind="value: pitch, valueUpdate: 'input'"
            />
          </div>
          <div>
            <label>绕Y轴旋转</label
            ><input
              id="roll"
              type="range"
              min="0"
              max="360"
              step="1.0"
              title="roll"
              data-bind="value: roll, valueUpdate: 'input'"
            />
          </div>
          <div>
            <label>绕Z轴旋转</label
            ><input
              id="heading"
              type="range"
              min="0"
              max="360"
              step="1.0"
              title="heading"
              data-bind="value: heading, valueUpdate: 'input'"
            />
          </div>

          <div>
            <label>缩放</label
            ><input
              type="range"
              id="scale"
              min="1"
              max="10"
              step="0.1"
              value="1"
              title="模型缩放比例"
              data-bind="value: scale, valueUpdate: 'input'"
            />
          </div>

          <div>
            <label>颜色</label
            ><input
              class="colorPicker"
              size="8"
              data-bind="value: material,valueUpdate: 'input'"
              id="colorPicker"
            />
          </div>

          <p>
            <label>移动</label>
          </p>
          <div>
            <div class="positionAdjust">
              <label>X:</label
              ><input type="text" readonly id="positionX" value="0" />
              <span
                id="XPlus"
                style="position: relative; top: -3px; height: 40%; right: 16px; width:8px;"
                class="fa fa-caret-up"
              ></span>
              <span
                id="XMinus"
                style=" position: relative;top: 5px; height: 40%; right: 28px; width:8px"
                class="fa fa-caret-down"
              ></span>
            </div>
            <div class="positionAdjust">
              <label>Y:</label
              ><input type="text" readonly id="positionY" value="0" />
              <span
                id="YPlus"
                style="position: relative; top: -3px; height: 40%; right: 16px; width:8px"
                class="fa fa-caret-up"
              ></span>
              <span
                id="YMinus"
                style=" position: relative;top: 5px; height: 40%; right: 28px; width:8px"
                class="fa fa-caret-down"
              ></span>
            </div>
            <div class="positionAdjust">
              <label>Z:</label
              ><input type="text" readonly id="positionZ" value="0" />
              <span
                id="ZPlus"
                style="position: relative; top: -3px; height: 40%; right: 16px; width:8px"
                class="fa fa-caret-up"
              ></span>
              <span
                id="ZMinus"
                style=" position: relative;top: 5px; height: 40%; right: 28px; width:8px"
                class="fa fa-caret-down"
              ></span>
            </div>
            <label id="delete" style="right:10px;position:relative;top:0;"
              >删除</label
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Cesium from "Cesium";
import {
  CesiumClickLayer,
  CesiumClickLeft,
  createCesium,
  openMap,
  setView
} from "../config/Configuration";
import {
  CesiumHandlerArea,
  CesiumHandlerDis,
  CesiumHandlerHeight
} from "../config/Measuring";
let viewer,
  serverUrl,
  plotting,
  plottingLayer,
  plotEditControl,
  handlerDis,
  handlerArea,
  handlerHeight,
  scene,
  stylePanel;

export default {
  name: "plot_dynamicPlot",
  data() {
    return {};
  },
  mounted() {
    this.loader();
  },
  methods: {
    deactiveAll() {
      handlerDis && handlerDis.deactivate();
      handlerArea && handlerArea.deactivate();
      handlerHeight && handlerHeight.deactivate();
    },
    distance() {
      this.deactiveAll();
      handlerDis && handlerDis.activate();
    },
    area() {
      this.deactiveAll();
      handlerArea && handlerArea.activate();
    },
    height() {
      this.deactiveAll();
      handlerHeight && handlerHeight.activate();
    },
    clear() {
      handlerDis && handlerDis.clear();
      handlerArea && handlerArea.clear();
      handlerHeight && handlerHeight.clear();
    },
    draw_text() {
      plottingLayer.removeAll();
      let point = [
        new Cesium.PlotPoint3D(
          102.06986722761297,
          24.96955121966692,
          1571.6802484637028
        )
      ];
      plottingLayer.createSymbol(0, 34, point, function(even) {
        let geo = even.feature;
        geo.textContent = "Supermap";
        geo.symbolTextStyle.foreColor = new Cesium.Color(1, 0, 0, 1);
        geo.symbolTextStyle.fontSize = 50;
        geo.symbolTextStyle.fontName = "Times New Roman";
      });
    },
    clearLayers() {
      plottingLayer.removeAll();
    },
    draw_dot() {
      plottingLayer.removeAll();
      let point = [
        new Cesium.PlotPoint3D(
          102.07023581119256,
          24.969594422800746,
          1575.4190939222883
        )
      ];
      plottingLayer.createSymbol(421, 30502, point);
    },
    draw_line() {
      plottingLayer.removeAll();
      let points = [];
      points[0] = new Cesium.PlotPoint3D(
        102.06988197556804,
        24.969722158409823,
        1574.1689433117238
      );
      points[1] = new Cesium.PlotPoint3D(
        102.06989351602357,
        24.969487185038716,
        1571.6157855966949
      );
      points[2] = new Cesium.PlotPoint3D(
        102.07005796362276,
        24.96972089097666,
        1572.042152964426
      );
      points[3] = new Cesium.PlotPoint3D(
        102.07013268343763,
        24.969533458879962,
        1571.89301488553
      );
      //创建标号
      plottingLayer.createSymbol(0, 24, points);
    },
    draw_polygon() {
      plottingLayer.removeAll();
      let points = [];
      points[0] = new Cesium.PlotPoint3D(75.3616029975312, 48.7966690280813, 0);
      points[1] = new Cesium.PlotPoint3D(81.432156521036, 35.6457727434013, 0);
      points[2] = new Cesium.PlotPoint3D(102.429727232917, 36.6596802340062, 0);
      points[3] = new Cesium.PlotPoint3D(114.503081229812, 50.7762562321923, 0);
      plottingLayer.createSymbol(0, 32, points);
    },
    InitPlot(viewer, serverUrl) {
      if (!viewer && !viewer.scene) {
        return;
      }
      plottingLayer = new Cesium.PlottingLayer(scene, "plottingLayer");
      scene.layers.add(plottingLayer);

      plotEditControl = new Cesium.PlotEditControl(window.scene, plottingLayer); //编辑控件
      plotEditControl.activate();

      plotting = Cesium.Plotting.getInstance(serverUrl, scene);

      stylePanel = new StylePanel("stylePanel", plotEditControl, plotting);
      window.stylePanel = stylePanel;
    },

    loader() {
      let vm = this;
      //若本地没有标绘相关服务则可访问支持中心的iserver
      viewer = createCesium("CesiumContainer");
      //new Cesium.Viewer("CesiumContainer");
      scene = viewer.scene;
      window.scene = scene;
      //globe : Globe 获取地球对象。
      scene.globe.depthTestAgainstTerrain = false;
      serverUrl =
        "http://47.103.125.18:8090/iserver/services/plot-JY/rest/plot";
      this.InitPlot(viewer, serverUrl);
      openMap(
        scene,
        "http://47.103.125.18:8090/iserver/services/3D-userMap/rest/realspace"
      ).then(res => {
        setView(
          scene,
          {
            x: -1209275.2260815133,
            y: 5655635.755705864,
            z: 2693069.1959136804
          },
          {
            heading: 1.0893126058187814,
            pitch: -0.4725302663268325,
            roll: 4.884981308350689e-14
          }
        );
        CesiumClickLeft(scene, (e, { x, y, z }) => {
          console.log(x, y, z);
        });
        CesiumClickLayer(viewer, function(feature) {
          // vm.$confirm(`这个是房屋详情XXXX`, "提示", {
          //   type: "success",
          //   showCancelButton: false,
          //   showConfirmButton: false,
          //   showClose: false
          // });
          console.log(feature, 123456);
        });
      });
      handlerDis = CesiumHandlerDis(viewer); // handlerDis activate();是调用开始  clear()清除
      handlerHeight = CesiumHandlerHeight(viewer);
      handlerArea = CesiumHandlerArea(viewer);

      // //“Delete”按键删除选中标号
      // $(document).keydown(function(event) {
      //   if (event.keyCode === 46) {
      //     deleteSeleGeo();
      //   }
      // });
    }, //删除指定标号
    deleteSeleGeo() {
      plottingLayer.removeGeoGraphicObject(plottingLayer.selectedFeature);
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
