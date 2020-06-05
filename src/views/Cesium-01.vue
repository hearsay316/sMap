<template>
  <div class="Cesium-01">
    <super-map :mounted-webgl="webgl"> </super-map>
  </div>
</template>

<script>
export default {
  name: "Cesium-01",
  methods: {
    webgl(viewer, Cesium) {
      console.log(viewer, Cesium);
    }
  }
};
</script>

<style scoped>
.Cesium-01 {
  text-align: left;
  position: relative;
}
</style>
