<template>
  <div>
    <div id="cesiumContainer"></div>
    <super-map :mounted-webgl="webgl"> </super-map>
    <super-map :mounted-webgl="webgl2"> </super-map>
  </div>
</template>

<script>
// const Cesium = window.Cesium;
export default {
  name: "Polylines",
  methods: {
    webgl(viewer, Cesium) {
      console.log(viewer);
      this.viewer = viewer;
      var startLon = -10;
      var endLon = 90;
      var lat = 0;
      var glowingLine = viewer.entities.add({
        name: "Glowing blue line on the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            startLon,
            lat,
            endLon,
            lat
          ]),
          width: 5,
          //followSurface : true,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.YELLOW
          })
        }
      });

      var redLine = viewer.entities.add({
        name: "Red line on the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
          width: 5,
          material: Cesium.Color.RED
        }
      });

      var glowingLine = viewer.entities.add({
        name: "Glowing blue line on the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
          width: 10,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.BLUE
          })
        }
      });

      var orangeOutlined = viewer.entities.add({
        name:
          "Orange line with black outline at height and following the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            39,
            250000,
            -125,
            39,
            250000
          ]),
          width: 10,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.ORANGE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK
          })
        }
      });

      var purpleArrow = viewer.entities.add({
        name: "Purple straight arrow at height",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            43,
            500000,
            -125,
            43,
            500000
          ]),
          width: 10,
          followSurface: false,
          material: new Cesium.PolylineArrowMaterialProperty(
            Cesium.Color.PURPLE
          )
        }
      });

      var dashedLine = viewer.entities.add({
        name: "Blue dashed line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            45,
            500000,
            -125,
            45,
            500000
          ]),
          width: 4,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.CYAN
          })
        }
      });

      var postion = [0, 45, 125, 45];
      var dynamicLine = viewer.entities.add({
        name: "RED dynamic line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(postion),
          width: 10,
          hMax: 500000,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.RED,
            outlineWidth: 0,
            outlineColor: Cesium.Color.BLACK
          })
        }
      });
      var dynamicLine2 = viewer.entities.add({
        name: "ORANGE dynamic line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(postion),
          width: 5,
          hMax: 550000,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.ORANGE,
            outlineWidth: 0,
            outlineColor: Cesium.Color.BLACK
          })
        }
      });
      var dynamicLine3 = viewer.entities.add({
        name: "Yellow dynamic line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(postion),
          width: 5,
          hMax: 600000,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.YELLOW,
            outlineWidth: 0,
            outlineColor: Cesium.Color.BLACK
          })
        }
      });
      var dynamicLine4 = viewer.entities.add({
        name: "GREEN dynamic line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(postion),
          width: 50,
          hMax: 650000,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.GREEN,
            outlineWidth: 0,
            outlineColor: Cesium.Color.BLACK
          })
        }
      });
      var dynamicLine5 = viewer.entities.add({
        name: "BLUE dynamic line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(postion),
          width: 5,
          hMax: 700000,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.BLUE,
            outlineWidth: 0,
            outlineColor: Cesium.Color.BLACK
          })
        }
      });
      var dynamicLine6 = viewer.entities.add({
        name: "CYAN dynamic line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(postion),
          width: 5,
          hMax: 750000,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.CYAN,
            outlineWidth: 0,
            outlineColor: Cesium.Color.BLACK
          })
        }
      });
      var dynamicLine7 = viewer.entities.add({
        name: "purple dynamic line",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(postion),
          width: 5,
          hMax: 800000,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: Cesium.Color.PURPLE,
            outlineWidth: 0,
            outlineColor: Cesium.Color.BLACK
          })
        }
      });

      viewer.zoomTo(viewer.entities);
    },
    webgl2(viewer) {
      var startLon = -10;
      var endLon = 90;
      var lat = 0;
      var glowingLine = viewer.entities.add({
        name: "Glowing blue line on the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            startLon,
            lat,
            endLon,
            lat
          ]),
          width: 5,
          //followSurface : true,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.YELLOW
          })
        }
      });

      var redLine = viewer.entities.add({
        name: "Red line on the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
          width: 7,
          material: Cesium.Color.RED
        }
      });

      var glowingLine = viewer.entities.add({
        name: "Glowing blue line on the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
          width: 10,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.BLUE
          })
        }
      });

      var orangeOutlined = viewer.entities.add({
        name:
          "Orange line with black outline at height and following the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            39,
            250000,
            -125,
            39,
            250000
          ]),
          width: 10,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.ORANGE,
            outlineWidth: 6,
            outlineColor: Cesium.Color.BLACK
          })
        }
      });
    }
  },
  mounted() {
    // var viewer = new Cesium.Viewer("cesiumContainer", {
    //   sceneModePicker: true,
    //   navigation: false
    // });
  }
};
</script>

<style scoped></style>
