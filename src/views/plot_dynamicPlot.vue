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
import { createCesium, setView } from "../config/Configuration";

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
    openMAP() {
      try {
        //添加S3M图层服务
        let promise = scene.open(
          "http://47.103.125.18:8090/iserver/services/3D-userMap/rest/realspace"
        );
        Cesium.when(
          promise,
          function(layers) {
            console.log(layers);
            if (!scene.pickPositionSupported) {
              alert("不支持深度拾取,属性查询功能无法使用！");
            }
            // 视角坐标检测 设置相机视角
            // setView(scene,{x: -20183889.354184173,
            //   y: 22645826.766457584,
            //   z: 3223367.6070640916},{
            //   heading: 5.662887035643514,
            //   pitch: -1.4213836938199456,
            //   roll: 9.769962616701378e-14
            // })
            let layer = scene.layers.find("Config");
            //设置属性查询参数
            layer.setQueryParameter({
              url:
                "http://47.103.125.18:8090/iserver/services/data-userMap/rest/data",
              dataSourceName: "testMap",
              dataSetName: "New_Region",
              keyWord: "SmID"
            });
          },
          function(e) {
            if (widget._showRenderLoopErrors) {
              let title = "渲染时发生错误，已停止渲染。";
              widget.showErrorPanel(title, undefined, e);
            }
          }
        );
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          let title = "渲染时发生错误，已停止渲染.";
          widget.showErrorPanel(title, undefined, e);
        }
      }
    },
    loader() {
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
      this.openMAP();
      let clampMode = 0;
      this.handler();
      this.handlerDis(clampMode);
      this.handlerArea(clampMode);
      this.handlerHeight(clampMode);
      // //“Delete”按键删除选中标号
      // $(document).keydown(function(event) {
      //   if (event.keyCode === 46) {
      //     deleteSeleGeo();
      //   }
      // });
    },
    handlerArea(clampMode) {
      //初始化测量面积
      handlerArea = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.Area,
        clampMode
      );
      handlerArea.measureEvt.addEventListener(function(result) {
        let mj = Number(result.area);
        let area =
          mj > 1000000
            ? (mj / 1000000).toFixed(2) + "km²"
            : mj.toFixed(2) + "㎡";
        handlerArea.areaLabel.text = "面积:" + area;
      });
      handlerArea.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
    },
    handlerHeight(clampMode) {
      //初始化测量高度
      handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH);
      handlerHeight.measureEvt.addEventListener(function(result) {
        let distance =
          result.distance > 1000
            ? (result.distance / 1000).toFixed(2) + "km"
            : result.distance + "m";
        let vHeight =
          result.verticalHeight > 1000
            ? (result.verticalHeight / 1000).toFixed(2) + "km"
            : result.verticalHeight + "m";
        let hDistance =
          result.horizontalDistance > 1000
            ? (result.horizontalDistance / 1000).toFixed(2) + "km"
            : result.horizontalDistance + "m";
        handlerHeight.disLabel.text = "空间距离:" + distance;
        handlerHeight.vLabel.text = "垂直高度:" + vHeight;
        handlerHeight.hLabel.text = "水平距离:" + hDistance;
      });
      handlerHeight.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
    },
    handler() {
      let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction(function(e) {
        console.log(scene.camera, scene.Cartesian3);
        //首先移除之前添加的点 需要if 一下 在添加小车的时候不能删除点
        //viewer.entities.removeAll();
        //获取点击位置笛卡尔坐标
        let positions = scene.pickPosition(e.position);
        //将笛卡尔坐标转化为经纬度坐标
        let cartographic = Cesium.Cartographic.fromCartesian(positions);
        let x = Cesium.Math.toDegrees(cartographic.longitude);
        let y = Cesium.Math.toDegrees(cartographic.latitude);
        let z = cartographic.height;
        if (z < 0) {
          z = 0;
        }
        console.log(x, y, z);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    handlerDis(clampMode) {
      //初始化测量距离
      handlerDis = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.Distance,
        clampMode
      );
      //注册测距功能事件
      handlerDis.measureEvt.addEventListener(function(result) {
        console.log(result);
        let dis = Number(result.distance);
        let distance =
          dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
        handlerDis.disLabel.text = "距离:" + distance;
      });
      handlerDis.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
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
