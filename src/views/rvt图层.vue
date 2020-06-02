<template>
  <div class="rvt">
    <div id="cesiumContainer"></div>
    <div class="rvt-test">
      <router-link to="/newDome">切换</router-link>
    </div>
  </div>
</template>

<script>
import { demoSingConfig } from "../config/mapConfig";

let viewer, scene;
import * as map from "../config/Configuration";
export default {
  name: "rvt图层",
  data() {
    return {
      url:
        "https://www.huaitaos.com:8443/iserver/services/3D-supermap03261643/rest/realspace",
      positionXYZ: {
        x: -1209550.6137063126,
        y: 5655779.937735093,
        z: 2693085.689269533
      },
      Config: "Config",
      Angle: {
        heading: 5.470688272479366,
        pitch: -0.8606068847349784,
        roll: 7.638334409421077e-14
      }
    };
  },
  async mounted(obj) {
    this.Config = demoSingConfig.Config;
    viewer = this.createCesium("cesiumContainer");
    scene = viewer.scene;
    //{ viewer, url, config, earth, mountedOpenMap, errorOpenMap }
    await this.openMap({
      viewer,
      url: this.url,
      config: this.Config,
      earth: {
        positionXYZ: this.positionXYZ,
        orientation: this.Angle
      }
    });
  },
  methods: {
    ...map
  }
};
</script>

<style scoped>
.rvt-test {
  position: fixed;
  top: 200px;
  left: 300px;
}
</style>
