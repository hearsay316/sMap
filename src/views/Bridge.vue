<template>
  <div class="Bridge">
    <super-map :url="url" :earth="earth" :mounted-webgl="webgl"> </super-map>
    <div class="BridgeButton" @click="handleNewDomeTitle">BridgeButton</div>
  </div>
</template>

<script>
import { setPositionView } from "@/config/Configuration";

export default {
  name: "Bridge",
  data() {
    return {
      earth: {
        //地球来的地址
        positionXYZ: {
          x: -31907059.63158584,
          y: 31790256.53609646,
          z: 6842226.596228782
        },
        orientation: {
          heading: 5.748175488108613,
          pitch: -1.5279875767724511,
          roll: 0
        }
      },
      /*X:  : X:   1.64368172336516 Y:   2.968757154435 Z:   11276.93   1.64382968097966 Y:   2.96858393854303 Z:   11276.35*/
      positionXYZ: {
        x: 6378702.129627192,
        y: 183144.88022634375,
        z: 331003.66296297376
      },
      angle: {
        // 位置放置角度
        heading: 0,
        pitch: 0,
        roll: 0
      },
      url:
        "https://www.huaitaos.com:8443/iserver/services/3D-mysuper/rest/realspace"
    };
  },
  methods: {
    webgl(viewer, Cesium) {
      console.log(viewer, Cesium);
      this.viewer = viewer;
      this.Cesium = Cesium;
    },
    handleNewDomeTitle() {
      // 首页专场的视角移动
      // 控制按钮
      /*
       * positionXYZ
       *
       * */
      setPositionView(this.viewer, this.positionXYZ, this.Cesium);
      // 导航栏显示
      //工具栏显示
    }
  }
};
</script>

<style scoped>
.Bridge {
  text-align: left;
  position: relative;
}
.BridgeButton {
  position: absolute;
  top: 15px;
  width: 150px;
  height: 150px;
  background: #000;
}
</style>
