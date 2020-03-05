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
    <div class="demo3-menu" v-if="demo3Menu" @click="demo3MenuClick">
      菜单
    </div>
    <div class="demo3-menu-item" v-if="demo3MenuItem">
      <div class="demo3-menu-item-test">
        <button
          @click="distance"
          type="button"
          id="distance"
          class="button"
          :class="{ black: !demo3MenuDistance }"
        >
          测距
        </button>
        <button
          type="button"
          @click="area"
          id="area"
          class="button "
          :class="{ black: !demo3MenuArea }"
        >
          测面
        </button>
        <button
          type="button"
          @click="height"
          id="height"
          class="button "
          :class="{ black: !demo3MenuHeight }"
        >
          测高
        </button>
        <button type="button" @click="clear" id="clear" class="button black">
          清除
        </button>
      </div>
      <div class="demo3-menu-item-Dynamic-drawing">
        <button
          @click="DynamicDrawing"
          type="button"
          class="button "
          :class="{ black: !demo3MenuPanel }"
        >
          动态绘图
        </button>
      </div>
      <div class="demo3-menu-item-Resource-deployment">
        <button
                @click="ResourceDeployment"
                type="button"
                class="button"
        >
          资源部署
        </button>
      </div>
    </div>
    <div
      id="menu"
      class="demo3-menu-Panel"
      :style="{ zIndex: demo3MenuPanelIndex }"
      style="position: absolute;width: 250px;height: 100%;border: 1px solid #3473b7;z-index: 98;"
    >
      <div
        class="easyui-panel"
        style="position:absolute;top:0px;bottom:0px;left:0px;right:0px;padding:5px; width: 100%;height: 100%"
      >
        <div class="easyui-tabs" style="width: 100%;height: 100%">
          <div
            id="plotPanel"
            title="标绘面板"
            style="  height: 100%;overflow: hidden;"
          ></div>
          <div
            id="stylePanel"
            title="属性面板"
            style="width: 290px;overflow: hidden"
          ></div>
        </div>
      </div>
    </div>
    <div class="resource-deployment-Panel">
      <div class="resource-deployment-Panel-title">
        模型库
      </div>
      <div>
        <input type="range" v-model="range" id="rotate" min="0" max="60" value="27" style="background: linear-gradient(to right, rgb(5, 156, 250), white 45%, white);">
      </div>
      <div class="resource-deployment-Panel-imgs">
        <div @click="resourceDeploymentPanelImg()"><img src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1943576682.jpg" alt=""></div>
        <div @click="resourceDeploymentPanelImg()"><img src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1943574824.jpg" alt=""></div>
        <div @click="resourceDeploymentPanelImg()"><img src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1943567046.jpg" alt=""></div>
        <div @click="resourceDeploymentPanelImg()"><img src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1943568933.jpg" alt=""></div>
      </div>
    </div>
  </div>
</template>

<script>
import Cesium from "Cesium";

let viewer, canvas;
let scene;
let widget;
let layer;
let x, y, z;
let cart;
let time;
let start;
let stop;
let FireParticleSystem;
let FireEntity;
let serverUrl,
  plotting,
  plottingLayer,
  plotEditControl,
  handlerDis,
  handlerArea,
  handlerHeight,
  stylePanel,
  plotDrawControl;
let MapFireXYZ = {
  x: 102.07025202712828,
  y: 24.969712733889363,
  z: 1577.620664980985
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
  watch:{
    range: {
      handler: function(val, oldVal) {
        // eslint-disable-next-line no-console
        console.log(val, oldVal);
        let value = Number(val);
        this.rotate(value);
      },
      deep: true
    }
  },
  data() {
    return {
      range:0,
      demo3MenuHeight: false,
      demo3MenuArea: false,
      demo3MenuDistance: false,
      demo3MenuPanel: false,
      demo3Menu: true,
      demo3MenuItem: false,
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
      MapWaterXYZ: [],
      demo3MenuPanelIndex: -1
    };
  },
  mounted() {
    this.onload();
  },
  methods: {
    resourceDeploymentPanelImg(){
      console.log("点击添加")
      this.Status.isMapCart=!this.Status.isMapCart;
    },
    ResourceDeployment(){

    },
    rotate (value){
     let entity = cart ;
        if(!Cesium.defined(entity.currentPosition)){
            var position = entity.position;
           // var time = position._composite.intervals._intervals[0].stop;
            entity.currentPosition = position.getValue({dayNumber: 2457518,
              secondsOfDay: 75352.37397817126});
        }
        entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(entity.currentPosition, new Cesium.HeadingPitchRoll(value/10, 0, 0));
        console.log(entity.orientation,entity.currentPosition)
    },
    DynamicDrawing() {
      this.demo3MenuPanel = !this.demo3MenuPanel;
      if (this.demo3MenuPanel) {
        this.demo3MenuPanelIndex = 89;
      } else {
        this.demo3MenuPanelIndex = -1;
      }
    },
    deactiveAll() {
      handlerDis && handlerDis.deactivate();
      handlerArea && handlerArea.deactivate();
      handlerHeight && handlerHeight.deactivate();
    },
    distance() {
      this.deactiveAll();
      this.demo3MenuDistance = true;
      handlerDis && handlerDis.activate();
    },
    area() {
      this.deactiveAll();
      this.demo3MenuArea = true;
      handlerArea && handlerArea.activate();
    },
    height() {
      this.deactiveAll();
      this.demo3MenuHeight = true;
      handlerHeight && handlerHeight.activate();
    },
    clear() {
      handlerDis && handlerDis.clear();
      handlerArea && handlerArea.clear();
      handlerHeight && handlerHeight.clear();
    },
    demo3MenuClick() {
      this.demo3Menu = false;
      this.demo3MenuItem = true;
    },
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
    InitPlot(viewer, serverUrl) {
      if (!viewer) {
        return;
      }
      plottingLayer = new Cesium.PlottingLayer(scene, "plottingLayer");
      scene.layers.add(plottingLayer);

      plotEditControl = new Cesium.PlotEditControl(window.scene, plottingLayer); //编辑控件
      window.plotEditControl = plotEditControl;
      plotDrawControl = new Cesium.PlotDrawControl(window.scene, plottingLayer); //绘制控件
      plotDrawControl.drawFinishEvent.addEventListener(function() {
        //标绘结束，激活编辑控件
        plotEditControl.activate();
      });

      plotting = Cesium.Plotting.getInstance(serverUrl, scene);
      //标绘面板
      initPlotPanel(
        "plotPanel",
        serverUrl,
        plotDrawControl,
        plotEditControl,
        plotting
      );
      stylePanel = new StylePanel("stylePanel", plotEditControl, plotting);
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
      let vm = this;
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
          console.log(222);
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          vm.demo3MenuDistance = false;
          viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
    },
    handlerArea(clampMode) {
      let vm = this;
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
          vm.demo3MenuArea = false;
          viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
    },
    handlerHeight(clampMode) {
      let vm = this;
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
          vm.demo3MenuHeight = false;
          viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
    },
    onload() {
      let vm = this;
      var infoboxContainer = document.getElementById("bubble");
      //初始化viewer部件
      viewer = new Cesium.Viewer("cesiumContainer");
      viewer.customInfobox = infoboxContainer;
      scene = viewer.scene;
      window.scene = scene;
      //globe : Globe 获取地球对象。
      scene.globe.depthTestAgainstTerrain = false;
      serverUrl =
        "http://47.103.125.18:8090/iserver/services/plot-JY/rest/plot";
      canvas = scene.canvas;
      widget = viewer.cesiumWidget;
      //globe : Globe 获取地球对象。
      this.InitPlot(viewer, serverUrl);
      let clampMode = 0;
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

            //  -20183889.354184173,
            // 22645826.766457584,
            //         3223367.6070640916
            /*
            * x: -1208997.92439027
y: 5655760.227195323
z: 2693548.99315424
            * */
            //设置相机视角
            scene.camera.setView({
              destination: new Cesium.Cartesian3(
                      -1208997.92439027,
                      5655760.22719532,
                      2693548.99315424
              ),
              orientation: {
                // heading: 5.662887035643514,
                // pitch: -1.4213836938199456,
                // roll: 9.769962616701378e-14
                heading: 2.0654134497388776,
                pitch: -0.8748266534458269,
                roll: 6.283185307179238
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
      this.handler();
      this.handlerDis(clampMode);
      this.handlerArea(clampMode);
      this.handlerHeight(clampMode);
      //添加自定义infobox
      var title = document.getElementById("title");
      var des = document.getElementById("des");
      var myimg = document.getElementById("myimg");
      viewer.selectedEntityChanged.addEventListener(function(entity) {
        if (entity && viewer.selectedEntity.name) {
          // vm.$confirm(`这个是小车${viewer.selectedEntity.name}`, "提示", {
          //   type: "success",
          //   showCancelButton: false,
          //   showConfirmButton: false,
          //   showClose: false
          // });
        }
      });
      //注册鼠标点击事件
      viewer.pickEvent.addEventListener(function(feature) {
        console.log(feature, scene.camera, scene.Cartesian3);
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
        var positions = scene.pickPosition(e.position);
        //将笛卡尔坐标转化为经纬度坐标
        var cartographic = Cesium.Cartographic.fromCartesian(positions);
        x = Cesium.Math.toDegrees(cartographic.longitude);
        y = Cesium.Math.toDegrees(cartographic.latitude);
        z = cartographic.height;
        if (z < 0) {
          z = 0;
        }
        if(vm.Status.isMapCart){
          vm.HandleS3MountedMapCart();
        }

      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  }
};
</script>

<style scoped>
.S3 {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.demo3-menu-Panel {
  top: 0;
  background: #fff;
  overflow: hidden;
}
.easyui-panel {
  box-sizing: border-box;
}
.demo3-menu-item {
  position: absolute;
  top: 10px;
  right: 20px;
  background: #fff;
  padding: 5px 8px;
  border-radius: 8px;
}
.demo3-menu {
  position: absolute;
  top: 10px;
  right: 20px;
  background: #fff;
  padding: 5px 8px;
  border-radius: 8px;
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
.bgcolor {
  background: #00e5e5;
}
  .resource-deployment-Panel{
    position: absolute;
    width: 260px;
    top:0;
    left: 8px;
    bottom: 0;
    margin: auto;
    border-radius: 18px;
    height: 70%;
    background: #fff;
  }
  .resource-deployment-Panel-title{
    font-size: 19px;
    color: rgb(6, 106, 117);
    padding: 15px;
    font-family: 'FranchiseRegular','Arial Narrow',Arial,sans-serif;
    font-weight: bold;
    text-align: center;
  }
  .resource-deployment-Panel-imgs{
    padding: 8px;
    width: 95%;
  }
</style>
