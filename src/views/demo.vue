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
      <el-button
        type="primary"
        @click="HandleClickS3Move"
        v-if="Status.isMapSystem"
        >进入系统演示</el-button
      >
      <el-button type="primary" @click="HandleS3Deploy" v-if="Status.isMapFire">
        开始部署</el-button
      >

      <el-button
        type="primary"
        v-if="Status.isMapCart"
        @click="HandleS3CreateFireFighting"
      >
        启动预案</el-button
      >
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
let FireParticleSystem;
let FireEntity;
let MapFireXYZ = {
  x: 102.07025202712828,
  y: 24.969712733889363,
  z: 1573.026203891956
  //1572.026203891956
};
let carts = [];
let positionXYZ = [
  {
    x: 102.06943685862204,
    y: 24.969427388802274,
    z: 1571.2370406630653,
    name: "cart1"
  },
  {
    x: 102.06946361643989,
    y: 24.96939567838009,
    z: 1571.213370078212,
    name: "cart2"
  },
  {
    x: 102.06953602518084,
    y: 24.969451096085642,
    z: 1571.356784142299,
    name: "cart3"
  }
];
let WaterParticleSystems = [];
export default {
  name: "S3MTiles",
  computed: {
    eachS3Move() {
      return this.S3Move.isMapFire + this.S3Move.isMapCart === 2;
    }
  },
  data() {
    return {
      entity: undefined,
      S3Move: {
        isMapFire: 0,
        isMapCart: 0
      },
      Status: {
        isMapFire: false,
        isMapCart: false,
        isMapSystem: true
      },
      MapFireXYZ: {
        x: 102.07025202712828,
        y: 24.969712733889363,
        z: 1577.620664980985
      },
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
      let { x, y, z } = MapFireXYZ;
      let { x: x1, y: y1, z: z1 } = positionXYZ[0];
      let { x: x2, y: y2, z: z2 } = positionXYZ[1];
      let { x: x3, y: y3, z: z3 } = positionXYZ[2];
      let index = 500;
      let addx = (x - x1) / index;
      let addy = (y - y1) / index;
      let addz = (z - z1) / index;
      let cart1 = carts[0];
      let cart2 = carts[1];
      let cart3 = carts[2];
      console.log(carts, 3333);
      time = setInterval(() => {
        if (index === 100) {
          clearInterval(time);
          carts.forEach(cart => {
            vm.HandleS3MountedWater(cart);
          });
          return;
        }
        x1 += addx;
        y1 += addy;
        z1 += addz;
        x2 += addx;
        y2 += addy;
        z2 += addz;
        x3 += addx;
        y3 += addy;
        z3 += addz;
        var position1 = Cesium.Cartesian3.fromDegrees(x1, y1, z1);
        cart1.position = position1;
        var position2 = Cesium.Cartesian3.fromDegrees(x2, y2, z2);
        cart2.position = position2;
        var position3 = Cesium.Cartesian3.fromDegrees(x3, y3, z3);
        cart3.position = position3;
        --index;
      }, 0);
    },
    HandleS3Create(eventStatus) {
      Object.keys(this.Status).forEach(item => {
        console.log(item === eventStatus, item, eventStatus);
        if (item === eventStatus) {
          this.Status[eventStatus] = !this.Status[eventStatus];
        } else {
          this.Status[item] = false;
        }
      });
    },
    HandleS3MountedWater(cart) {
      let vm = this;
      var emitterModelMatrix = new Cesium.Matrix4();
      var translation = new Cesium.Cartesian3();
      var rotation = new Cesium.Quaternion();
      var hpr = new Cesium.HeadingPitchRoll();
      var trs = new Cesium.TranslationRotationScale();
      var entity = cart;
      var viewModel = {
        emissionRate: 40.0,
        gravity: -3.5,
        minimumParticleLife: 6,
        maximumParticleLife: 7,
        minimumSpeed: 9,
        maximumSpeed: 9.5,
        startScale: 1,
        endScale: 20,
        particleSize: 1
      };
      // viewer.zoomTo(entity);
      vm.HandleClickS3Fire();
      scene.logarithmicDepthBuffer = false;
      //关闭HDR
      scene.highDynamicRange = false;
      console.log(222);
      let WaterParticleSystem = viewer.scene.primitives.add(
        new Cesium.ParticleSystem({
          image:
            "http://support.supermap.com.cn:8090/webgl/examples/images/ParticleSystem/fountain2.png",
          startColor: new Cesium.Color(1, 1, 1, 0.6),
          endColor: new Cesium.Color(0.8, 0.86, 1, 0.4),
          startScale: viewModel.startScale,
          endScale: viewModel.endScale,
          minimumParticleLife: viewModel.minimumParticleLife,
          maximumParticleLife: viewModel.maximumParticleLife,
          minimumSpeed: viewModel.minimumSpeed,
          maximumSpeed: viewModel.maximumSpeed,
          imageSize: new Cesium.Cartesian2(
            viewModel.particleSize,
            viewModel.particleSize
          ),
          emissionRate: viewModel.emissionRate,
          //粒子发射器
          emitter: new Cesium.CircleEmitter(0.2),
          emitterModelMatrix: computeEmitterModelMatrix(),
          //  updateCallback: applyGravity,
          sizeInMeters: true,
          performance: false,
          lifetime: 16.0 // 默认情况下，粒子系统将永远运行。要使粒子系统运行一定的持续时间，请使用lifetime以秒为单位指定持续时间并将其设置loop为false。
        })
      );
      WaterParticleSystems.push(WaterParticleSystem);
      viewer.scene.preUpdate.addEventListener(function(scene, time) {
        WaterParticleSystem.modelMatrix = computeModelMatrix(entity, time);
        // Account for any changes to the emitter model matrix.
        WaterParticleSystem.emitterModelMatrix = computeEmitterModelMatrix();
      });
      this.HandleS3DestroyedFire();
      function computeModelMatrix(entity, time) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4());
      }

      // 改变粒子系统的位置
      function computeEmitterModelMatrix() {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0, 80, 220, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(
          0,
          0,
          5.4,
          translation
        );
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
        return Cesium.Matrix4.fromTranslationRotationScale(
          trs,
          emitterModelMatrix
        );
      }
    },
    HandleS3DestroyedFire() {
      let index = 1;
      let vm = this;
      let time = setInterval(() => {
        if (index <= 0) {
          clearInterval(time);
          viewer.entities.remove(FireEntity);
          WaterParticleSystems.forEach(WaterParticleSystem =>
            scene.primitives.remove(WaterParticleSystem)
          );
          this.$confirm("灭火成功,演示完毕", "提示", {
            type: "success",
            showCancelButton: false,
            showConfirmButton: false,
            showClose: false
          });
        }
        index -= 0.05;
        var particleSize = parseFloat(index);
        FireParticleSystem.minimumImageSize.x = particleSize;
        FireParticleSystem.minimumImageSize.y = particleSize;
        FireParticleSystem.maximumImageSize.x = particleSize;
        FireParticleSystem.maximumImageSize.y = particleSize;
      }, 400);
    },
    HandleS3MountedFire() {
      let vm = this;
      let { x, y, z } = MapFireXYZ;
      var position = Cesium.Cartesian3.fromDegrees(x, y, z);
      console.log(viewer.entities);
      FireEntity = viewer.entities.add({
        position: position,
        name: "99999999999",
        id: "id"
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
      FireParticleSystem = scene.primitives.add(
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
        FireParticleSystem.modelMatrix = computeModelMatrix(FireEntity, time);
        // Account for any changes to the emitter model matrix.
        FireParticleSystem.emitterModelMatrix = computeEmitterModelMatrix();
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
    HandleS3Deploy() {
      let vm = this;
      vm.$message({
        message: "部署成功",
        type: "success"
      });
      vm.Status.isMapFire = false;
      vm.Status.isMapCart = true;
      positionXYZ.forEach(xyz => {
        let { x, y, z, name } = xyz;
        var position = Cesium.Cartesian3.fromDegrees(x, y, z);
        let cart = viewer.entities.add({
          name: name,
          model: {
            uri:
              "http://support.supermap.com.cn:8090/webgl/examples/SampleData/models/Cesium_Ground.gltf",
            minimumPixelSize: 32,
            maximumScale: 0.5
          },
          viewFrom: new Cesium.Cartesian3(x, y, z),
          position: position
        });
        carts.push(cart);
      });
    },
    HandleS3MountedMapCart() {
      var position = Cesium.Cartesian3.fromDegrees(x, y, z);
      cart = viewer.entities.add({
        name: "5555",
        model: {
          uri:
            "http://support.supermap.com.cn:8090/webgl/examples/SampleData/models/Cesium_Ground.gltf",
          minimumPixelSize: 32
        },
        viewFrom: new Cesium.Cartesian3(x, y, z),
        position: position
      });
      carts.push(cart);
    },
    HandleClickS3Fire() {
      try {
        if (scene.camera) {
          scene.camera.setView({
            destination: new Cesium.Cartesian3(
              -1209371.1848499542,
              5655586.079866716,
              2693109.1253441786
            ),
            orientation: {
              heading: 6.283185042289299,
              pitch: -0.7854026364258244,
              roll: 6.283185307179586
            }
          });
        } else {
          console.log(scene);
        }
      } catch (e) {
        console.log(e);
      }
    },
    HandleClickS3Move() {
      let vm = this;
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
          this.HandleS3MountedFire();
          vm.$message({
            message: "切换场景成功",
            type: "success"
          });
          vm.Status.isMapSystem = false;
          vm.Status.isMapFire = true;
        } else {
          console.log(scene);
        }
      } catch (e) {
        console.log(e);
        vm.$message({
          message: "切换场景失败",
          type: "success"
        });
      }
    },
    onload() {
      let vm = this;
      var infoboxContainer = document.getElementById("bubble");
      //初始化viewer部件
      viewer = new Cesium.Viewer("cesiumContainer");
      viewer.customInfobox = infoboxContainer;
      scene = viewer.scene;
      canvas = scene.canvas;
      widget = viewer.cesiumWidget;
      this.$refs.loadingbar.remove();
      try {
        //https://www.huaitaos.com:8443/iserver/services/3D-supermap03261643/rest/realspace
        //添加S3M图层服务
        var promise = scene.open(
          "https://www.huaitaos.com:8443/iserver/services/3D-supermap03261643/rest/realspace"
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
                "https://www.huaitaos.com:8443/iserver/services/data-userMap/rest/data",
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
      viewer.selectedEntityChanged.addEventListener(function(entity) {
        if (entity) {
          vm.$confirm(`这个是小车${viewer.selectedEntity.name}`, "提示", {
            type: "success",
            showCancelButton: false,
            showConfirmButton: false,
            showClose: false
          });
        }
      });
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
        var pick = viewer.scene.pick(e.position);
        // console.log(pick)
        //console.log(scene.camera, scene.Cartesian3);
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
  border-radius: 8px;
}
.bubble {
  position: absolute;
  background: #fff;
  padding: 8px;
}
</style>
