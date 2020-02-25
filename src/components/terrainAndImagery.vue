<template>
  <div>
    <div id="cesiumContainer"></div>
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
    <!--    <material-picker v-model="colors" />-->
    <material class="material" v-model="colors"></material>
    <!--<div id="toolbar" ref="toolbar" class="param-container tool-bar">
      <div class="param-item">
        <label>颜色透明</label>
        <input
          class="colorPicker"
          ref="colorPicker"
          size="8"
          data-bind="value: color,valueUpdate: 'input'"
          id="colorPicker"
        />
      </div>
      <div class="param-item">
        <label>颜色透明容限</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          data-bind="value: tolerance,valueUpdate: 'input'"
          id="tolerance"
          style="display: block;width:200px;margin: 5px 0"
        />
      </div>
    </div>-->
  </div>
</template>

<script>
import { URL_CONFIG } from "../config/UrlConfig";
import { Sketch } from "vue-color";
import Cesium from "Cesium";
let layer = null;
let viewer = null;
export default {
  name: "terrainAndImagery",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    material: Sketch
  },
  watch: {
    colors: {
      handler: function(val, oldVal) {
        // eslint-disable-next-line no-console
        console.log(val, oldVal);
        val.hex !== oldVal.hex
          ? (layer.transperantBackColor = Cesium.Color.fromCssColorString(
              val.hex
            ))
          : void 0;

        oldVal.a !== val.a
          ? (layer.transperantBackColorTolerance = val.a)
          : void 0;
      },
      deep: true
    }
  },
  data() {
    return {
      colors: {
        r: 0,
        g: 0,
        b: 255,
        a: 0.5
      }
    };
  },
  methods: {
    load() {
      /* eslint-disable */
      viewer = new Cesium.Viewer("cesiumContainer", {
        //创建地形服务提供者的实例，url为SuperMap iServer发布的TIN地形服务
        // terrainProvider 使用的地形提供者。 CesiumTerrainProvider :提供地形切片，通过STK地形服务或者SuperMap iServer REST API。
        terrainProvider: new Cesium.CesiumTerrainProvider({
          url: URL_CONFIG.SiChuan_TERRAIN,
          isSct: true //地形服务源自SuperMap iServer发布时需设置isSct为true
        })
      });
      //添加SuperMap iServer发布的影像服务  addImageryProvider:通过给定的影像服务提供者新建图层，将其添加至图层集合中。
      layer = viewer.imageryLayers.addImageryProvider(
        // SuperMapImageryProvider 提供影像切片，通过SuperMap iServer REST API。
        new Cesium.SuperMapImageryProvider({
          url: URL_CONFIG.SiChuan_IMG
        })
      );
      //http://support.supermap.com.cn:8090/webgl/Build/Documentation/Scene.html?classFilter=scene
      //三维场景类，它是所有三维图形对象和状态的容器，通常不直接创建场景，而是由CesiumWidget隐式创建。
      ////scene 创建一个场景。
      //camera 获取当前场景的相机对象。
      // setView 设置相机位置、方向和变换。
      viewer.scene.camera.setView({
        /*
        destination	Cartesian3 | Rectangle	optional相机在WGS84世界坐标系中的最终位置，或是自顶向下视图中可见的矩形区域。
        orientation	Object	optional包含了方位(direction)、上方向(up)以及方位角(heading)、俯仰角(pitch)、滚动角(roll)属性的对象。 默认情况下，3D中方位(direction)指向框架中心，在Columbus视图中指向负z方向。 在3D中上方向(up)指向本地北方向，而在Columbus视图中指向正y方向。在无限滚动模式下，二维视图不使用方向(orientation)。
        endTransform	Matrix4	optional表示相机参考坐标系的变换矩阵。
                  */
        destination: new Cesium.Cartesian3( // Cartesian3 :三维笛卡尔坐标点。
          -1206939.1925299785,
          5337998.241228442,
          3286279.2424502545
        ),
        orientation: {
          heading: 1.4059101895600987,
          pitch: -0.20917672793046682,
          roll: 2.708944180085382e-13
        }
      });
      var viewModel = {
        color: `rgb(${this.colors.r}, ${this.colors.g}, ${this.colors.b})`,
        tolerance: this.colors.a
      };
      Cesium.knockout.track(viewModel);
      // var toolbar = document.getElementById("toolbar");
      // var toolbar = this.$refs.toolbar;
      // Cesium.knockout.applyBindings(viewModel, toolbar);
      // Cesium.knockout
      //   .getObservable(viewModel, "color")
      //   .subscribe(function(newValue) {
      //     console.log(newValue);
      //     var selectedColor = Cesium.Color.fromCssColorString(newValue);
      //     layer.transperantBackColor = selectedColor;
      //   });
      // Cesium.knockout
      //   .getObservable(viewModel, "tolerance")
      //   .subscribe(newValue => {
      //     console.log(newValue);
      //     layer.transperantBackColorTolerance = newValue;
      //   });
      this.$refs.loadingbar.remove();
      // $("#loadingbar").remove();
      // toolbar.show();
      /* eslint-enable */
    }
  },
  mounted() {
    this.load();
  }
};
</script>

<style scoped>
.material {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
