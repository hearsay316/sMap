<template>
  <superMap
    :url="url"
    :Config="Config"
    :positionXYZ="positionXYZ"
    :Angle="Angle"
    :createWebgl="createWebgl"
    :mountedWebgl="mountedWebgl"
    :mountedOpenMap="mountedOpenMap"
    :errorOpenMap = "errorOpenMap"
  ></superMap>
</template>

<script>
export default {
  name: "rvt图层SuperMap.vue",
  data() {
    return {
      url: //http://47.103.125.18:8090/iserver/services/3D-ditie/rest/realspace
        "http://47.103.125.18:8090/iserver/services/3D-ditie/rest/realspace",
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
  mounted() {},
  methods: {
    mountedWebgl(viewer) {
      console.log(viewer, 666);
    },
    mountedOpenMap() {},
    createWebgl() {},
    errorOpenMap(e){}
  }
};
</script>

<style scoped></style>
