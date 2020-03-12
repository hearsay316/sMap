<template>
  <div class="rvt">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
let viewer, scene;
import * as map from "../config/Configuration";
export default {
  name: "rvt图层",
  data() {
    return {
      url:
        "http://47.103.125.18:8090/iserver/services/3D-userMap/rest/realspace",
      positionXYZ: {
        x: -1209550.6137063126,
        y:  5655779.937735093,
        z: 2693085.689269533
      },
        Config:"Config",
        Angle:{
          heading: 5.470688272479366,
          pitch: -0.8606068847349784,
          roll: 7.638334409421077e-14
        }
    };
  },
  async mounted() {
    viewer = this.createCesium("cesiumContainer");
    scene = viewer.scene;
    console.log(2225);
    await this.openMap(scene, this.url,this.Config,this.positionXYZ,this.Angle);
  },
  methods: {
    ...map
  }
};
</script>

<style scoped></style>
