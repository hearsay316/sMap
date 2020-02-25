<template>
  <div class="S3">
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
    <blockquote id="bubble" class="bubble">
      <img
        id="myimg"
        src="http://support.supermap.com.cn:8090/iserver/iClient/for3D/webgl/zh/examples/images/home_banner.jpg"
        width="50%"
        height="auto"
      />
      <h2 id="title"></h2>
      <p id="des" class="word"></p>
      <audio controls="controls">
        <source
          src="http://support.supermap.com.cn:8090/iserver/iClient/for3D/webgl/zh/examples/media/song.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio tag.
      </audio>
    </blockquote>
    <div class="S3-move">
      <div @click="HandleClickS3Move">点击切换场景</div>
      <div @click="HandleS3CreateMapFire">点击着火</div>
      <div @click="HandleS3CreateMapCart">点击添加小车</div>
      <div @click="HandleS3CreateFireFighting">救火</div>
      <div @click="HandleS3CreateWater">扫水</div>
    </div>
  </div>
</template>

<script>
import Cesium from "Cesium";
var viewer, canvas;
var scene;
var widget;
var layer;
let x, y, z;
let cart;
let time;
let start;
let stop;
export default {
  name: "S3MTiles",
  data() {
    return {
      isMapFire: false,
      isMapCart: false,
      isMapWater: false,
      MapFireXYZ: [],
      MapCartXYZ: [],
      MapWaterXYZ: []
    };
  },
  mounted() {
    this.onload();
  },
  methods: {
    HandleS3CreateFireFighting() {
      let vm = this;
      console.log(viewer.entities, cart);
      let { x, y, z } = this.MapFireXYZ[0];
      let { x: x1, y: y1, z: z1 } = this.MapCartXYZ[0];
      console.log(x1, y1, z1);
      console.log(x, y, z);
      let index = 500;
      let x2 = (x - x1) / index;
      let y2 = (y - y1) / index;
      let z2 = (z - z1) / index;
      time = setInterval(() => {
        if (index === 100) {
          clearInterval(time);
          vm.winter = {
            x: x1,
            y: x1,
            z: z1
          };
          vm.HandleS3MountedWater();
          return;
        }
        x1 += x2;
        y1 += y2;
        z1 += z2;
        var position = Cesium.Cartesian3.fromDegrees(x1, y1, z1);
        cart.position = position;
        console.log(111);
        --index;
      }, 0);
    },
    HandleS3CreateWater() {
      this.isMapWater = !this.isMapWater;
    },
    HandleS3MountedWater() {
      //let { x: x1, y: y1, z: z1 } = this.winter;
      // var pos1 = Cesium.Cartesian3.fromDegrees(x, y, z);
      // var pos2 = Cesium.Cartesian3.fromDegrees(x1, y1, z1);
      // var position = new Cesium.SampledPositionProperty();
      //
      // position.addSample(start, pos1);
      // position.addSample(stop, pos2);
      //
      console.log(x, y, z);
      var position = Cesium.Cartesian3.fromDegrees(x, y, z);
      console.log(viewer.entities);
      var entity = viewer.entities.add({
        position: position
      });
      let viewModel = {
        emissionRate: 200,
        minimumParticleLife: 1.5,
        maximumParticleLife: 1.8,
        minimumSpeed: 7.0,
        maximumSpeed: 9.0,
        startScale: 3.0,
        endScale: 1.5,
        particleSize: 1
      };
      let particleSystem = scene.primitives.add(
        new Cesium.ParticleSystem({
          // 粒子的图片
          image:
            "http://support.supermap.com.cn:8090/webgl/examples/images/ParticleSystem/fountain2.png",
          // 起始颜色
          startColor: new Cesium.Color(1, 1, 1, 0.6),
          endColor: new Cesium.Color(0.8, 0.86, 1, 0.4),
          // 开始大小比例
          startScale: viewModel.startScale,
          // 结束大小比例
          endScale: viewModel.endScale,
          // 最小生命周期
          minimumParticleLife: viewModel.minimumParticleLife,
          // 最大生命周期
          maximumParticleLife: viewModel.maximumParticleLife,
          // 最小速度
          minimumSpeed: viewModel.minimumSpeed,
          // 最大速度
          maximumSpeed: viewModel.maximumSpeed,
          // 粒子大小
          imageSize: new Cesium.Cartesian2(
            viewModel.particleSize,
            viewModel.particleSize
          ),
          // 粒子数量
          emissionRate: viewModel.emissionRate,
          lifetime: 16,
          // 循环是否开启
          loop: true,
          // 粒子的释放方向
          emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),
          // 是否以米为单位
          sizeInMeters: true
        })
      );

      viewer.scene.preUpdate.addEventListener(function(scene, time) {
        particleSystem.modelMatrix = computeModelMatrix(entity, time);
        // Account for any changes to the emitter model matrix.
        particleSystem.emitterModelMatrix = computeEmitterModelMatrix();
      });

      function computeModelMatrix(entity, time) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4());
      }

      var emitterModelMatrix = new Cesium.Matrix4();
      var translation = new Cesium.Cartesian3();
      var rotation = new Cesium.Quaternion();
      var hpr = new Cesium.HeadingPitchRoll();
      var trs = new Cesium.TranslationRotationScale();

      // 改变粒子系统的位置
      function computeEmitterModelMatrix() {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(-2, 0, 2, translation);
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
        return Cesium.Matrix4.fromTranslationRotationScale(
          trs,
          emitterModelMatrix
        );
      }
    },
    HandleS3MountedFire() {
      var position = Cesium.Cartesian3.fromDegrees(x, y, z);
      console.log(viewer.entities);
      var entity = viewer.entities.add({
        position: position
      });
      let viewModel = {
        emissionRate: 200,
        minimumParticleLife: 1.5,
        maximumParticleLife: 1.8,
        minimumSpeed: 7.0,
        maximumSpeed: 9.0,
        startScale: 3.0,
        endScale: 1.5,
        particleSize: 1
      };
      let particleSystem = scene.primitives.add(
        new Cesium.ParticleSystem({
          // 粒子的图片
          image:
            "http://support.supermap.com.cn:8090/webgl/examples/images/ParticleSystem/fire.png",
          // 起始颜色
          startColor: new Cesium.Color(1, 1, 1, 1),
          // 结束颜色
          endColor: new Cesium.Color(1, 0, 0, 0),
          // 开始大小比例
          startScale: viewModel.startScale,
          // 结束大小比例
          endScale: viewModel.endScale,
          // 最小生命周期
          minimumParticleLife: viewModel.minimumParticleLife,
          // 最大生命周期
          maximumParticleLife: viewModel.maximumParticleLife,
          // 最小速度
          minimumSpeed: viewModel.minimumSpeed,
          // 最大速度
          maximumSpeed: viewModel.maximumSpeed,
          // 粒子大小
          imageSize: new Cesium.Cartesian2(
            viewModel.particleSize,
            viewModel.particleSize
          ),
          // 粒子数量
          emissionRate: viewModel.emissionRate,
          lifetime: 16,
          // 循环是否开启
          loop: true,
          // 粒子的释放方向
          emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),
          // 是否以米为单位
          sizeInMeters: true
        })
      );

      viewer.scene.preUpdate.addEventListener(function(scene, time) {
        particleSystem.modelMatrix = computeModelMatrix(entity, time);
        // Account for any changes to the emitter model matrix.
        particleSystem.emitterModelMatrix = computeEmitterModelMatrix();
      });

      function computeModelMatrix(entity, time) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4());
      }

      var emitterModelMatrix = new Cesium.Matrix4();
      var translation = new Cesium.Cartesian3();
      var rotation = new Cesium.Quaternion();
      var hpr = new Cesium.HeadingPitchRoll();
      var trs = new Cesium.TranslationRotationScale();

      // 改变粒子系统的位置
      function computeEmitterModelMatrix() {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(-2, 0, 2, translation);
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
        return Cesium.Matrix4.fromTranslationRotationScale(
          trs,
          emitterModelMatrix
        );
      }
    },
    HandleS3CreateMapFire() {
      this.isMapFire = !this.isMapFire;
    },
    HandleS3MountedMapCart() {
      var position = Cesium.Cartesian3.fromDegrees(x, y, z);
      cart = viewer.entities.add({
        model: {
          uri:
            "http://support.supermap.com.cn:8090/webgl/examples/SampleData/models/Cesium_Ground.gltf",
          minimumPixelSize: 64
        },
        viewFrom: new Cesium.Cartesian3(x, y, z),
        position: position
      });
    },
    HandleS3CreateMapCart() {
      this.isMapCart = !this.isMapCart;
      console.log(11);
    },
    HandleClickS3Move() {
      try {
        if (scene.camera) {
          scene.camera.setView({
            destination: new Cesium.Cartesian3(
              -1209550.6137063126,
              5655779.937735093,
              2693085.689269533
            ),
            orientation: {
              heading: 5.470688272479366,
              pitch: -0.8606068847349784,
              roll: 7.638334409421077e-14
            }
          });
        } else {
          console.log(scene);
        }
      } catch (e) {
        console.log(e);
      }
    },
    changePosition(value) {
      var sceme = viewer.scene;
      if (viewer.dataSources.length === 0) {
        sweetAlert("error", "Please add KML file firstly", "error");
        return;
      }
      var entity =
        viewer.dataSources._dataSources[0]._entityCollection._entities
          ._array[0];
      if (!Cesium.defined(entity.currentPosition)) {
        var position = entity.position;
        var time = position._composite.intervals._intervals[0].stop;
        entity.currentPosition = position.getValue(time);
      }
      var coordinate = Cesium.Cartographic.fromCartesian(
        entity.currentPosition
      );
      var longitude = Cesium.Math.toDegrees(coordinate.longitude);
      var latitude = Cesium.Math.toDegrees(coordinate.latitude);
      var height = coordinate.height;
      longitude -= value / 50000;
      latitude -= value / 50000;
      var newPosition = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      );
      entity.position = newPosition;
    },
    onload() {
      let vm = this;
      var infoboxContainer = document.getElementById("bubble");
      //初始化viewer部件
      viewer = new Cesium.Viewer("cesiumContainer");
      // viewer.imageryLayers.addImageryProvider(
      //   new Cesium.BingMapsImageryProvider({
      //     url: "https://dev.virtualearth.net",
      //     mapStyle: Cesium.BingMapsStyle.AERIAL,
      //     key: URL_CONFIG.BING_MAP_KEY
      //   })
      // );
      viewer.customInfobox = infoboxContainer;
      scene = viewer.scene;
      canvas = scene.canvas;
      widget = viewer.cesiumWidget;
      this.$refs.loadingbar.remove();
      try {
        //添加S3M图层服务
        var promise = scene.open(
          "http://47.103.125.18:8090/iserver/services/3D-userMap/rest/realspace"
        );
        Cesium.when(
          promise,
          function(layers) {
            if (!scene.pickPositionSupported) {
              alert("不支持深度拾取,属性查询功能无法使用！");
            }
            layer = scene.layers.find("Config");
            //设置属性查询参数
            layer.setQueryParameter({
              url:
                "http://47.103.125.18:8090/iserver/services/data-userMap/rest/data",
              dataSourceName: "testMap",
              dataSetName: "New_Region",
              keyWord: "SmID"
            });
            //设置相机视角
            scene.camera.setView({
              destination: new Cesium.Cartesian3(
                -20183889.354184173,
                22645826.766457584,
                3223367.6070640916
              ),
              orientation: {
                heading: 5.662887035643514,
                pitch: -1.4213836938199456,
                roll: 9.769962616701378e-14
              }
            });
          },
          function(e) {
            if (widget._showRenderLoopErrors) {
              var title = "渲染时发生错误，已停止渲染。";
              widget.showErrorPanel(title, undefined, e);
            }
          }
        );
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          var title = "渲染时发生错误，已停止渲染.";
          widget.showErrorPanel(title, undefined, e);
        }
      }
      //添加自定义infobox
      var title = document.getElementById("title");
      var des = document.getElementById("des");
      var myimg = document.getElementById("myimg");
      //注册鼠标点击事件
      viewer.pickEvent.addEventListener(function(feature) {
        console.log(feature, scene.camera, scene.Cartesian3); //Z: "1579.0816898133812"
        // USERID: "1"
        var titlei = Cesium.defaultValue(feature.Z, "");
        var description = Cesium.defaultValue(feature.USERID, "");
        console.log(title, description);
        title.innerText = titlei;
        des.innerText = description;
        myimg.src =
          "http://localhost:8090/iserver/iClient/for3D/webgl/zh/examples/images/" +
          title +
          ".jpg";
      });
      var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction(function(e) {
        //首先移除之前添加的点 需要if 一下 在添加小车的时候不能删除点
        //viewer.entities.removeAll();
        //获取点击位置笛卡尔坐标
        var positions = scene.pickPosition(e.position);
        //将笛卡尔坐标转化为经纬度坐标
        var cartographic = Cesium.Cartographic.fromCartesian(positions);
        x = Cesium.Math.toDegrees(cartographic.longitude);
        y = Cesium.Math.toDegrees(cartographic.latitude);
        z = cartographic.height;
        if (z < 0) {
          z = 0;
        }
        console.log(x, y, z);
        if (vm.isMapFire) {
          vm.MapFireXYZ.push({ x, y, z });
          vm.HandleS3MountedFire();
        }
        if (vm.isMapCart) {
          vm.MapCartXYZ.push({ x, y, z });
          vm.HandleS3MountedMapCart();
        }
        if (vm.isMapWater) {
          vm.MapWaterXYZ.push({ x, y, z });
          vm.HandleS3MountedWater();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  }
};
</script>

<style scoped>
.S3 {
  position: relative;
}
.S3-move {
  position: absolute;
  top: 10px;
  left: 20px;
  background: #fff;
  padding: 5px 8px;
}
.bubble {
  position: absolute;
  background: #fff;
  padding: 8px;
}
</style>
