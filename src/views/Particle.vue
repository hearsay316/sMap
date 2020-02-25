<template>
  <div class="particle">
    <div id="cesiumContainer" class="fullSize"></div>
    <div id="loadingOverlay"><h1>Loading...</h1></div>
    <div id="toolbar" class="params-setting-container">
      <div class="params-setting-anchor" title="显示/隐藏参数面板">
        <span class="fui-expand"></span>
      </div>
      <div class="params-setting">
        <table>
          <tbody>
            <tr>
              <td>数量</td>
              <td>
                <input
                  type="range"
                  min="0.0"
                  max="1000.0"
                  step="1"
                  style="width: 140px"
                  data-bind="value: emissionRate, valueUpdate: 'input'"
                />
                <input type="text" size="5" data-bind="value: emissionRate" />
              </td>
            </tr>

            <tr>
              <td>粒子大小</td>
              <td>
                <input
                  type="range"
                  min="0"
                  max="60.0"
                  step="0.1"
                  style="width: 140px"
                  data-bind="value: particleSize, valueUpdate: 'input'"
                />
                <input type="text" size="5" data-bind="value: particleSize" />
              </td>
            </tr>

            <tr>
              <td>最小生命周期</td>
              <td>
                <input
                  type="range"
                  min="0.1"
                  max="30.0"
                  step="1"
                  style="width: 140px"
                  data-bind="value: minimumParticleLife, valueUpdate: 'input'"
                />
                <input
                  type="text"
                  size="5"
                  data-bind="value: minimumParticleLife"
                />
              </td>
            </tr>

            <tr>
              <td>最大生命周期</td>
              <td>
                <input
                  type="range"
                  min="0.1"
                  max="30.0"
                  step="1"
                  style="width: 140px"
                  data-bind="value: maximumParticleLife, valueUpdate: 'input'"
                />
                <input
                  type="text"
                  size="5"
                  data-bind="value: maximumParticleLife"
                />
              </td>
            </tr>

            <tr>
              <td>最小速度</td>
              <td>
                <input
                  type="range"
                  min="0.0"
                  max="30.0"
                  step="1"
                  style="width: 140px"
                  data-bind="value: minimumSpeed, valueUpdate: 'input'"
                />
                <input type="text" size="5" data-bind="value: minimumSpeed" />
              </td>
            </tr>

            <tr>
              <td>最大速度</td>
              <td>
                <input
                  type="range"
                  min="0.0"
                  max="30.0"
                  step="1"
                  style="width: 140px"
                  data-bind="value: maximumSpeed, valueUpdate: 'input'"
                />
                <input type="text" size="5" data-bind="value: maximumSpeed" />
              </td>
            </tr>

            <tr>
              <td>初始比例</td>
              <td>
                <input
                  type="range"
                  min="0.0"
                  max="10.0"
                  step="1"
                  style="width: 140px"
                  data-bind="value: startScale, valueUpdate: 'input'"
                />
                <input type="text" size="5" data-bind="value: startScale" />
              </td>
            </tr>

            <tr>
              <td>终止比例</td>
              <td>
                <input
                  type="range"
                  min="0.0"
                  max="10.0"
                  step="1"
                  style="width: 140px"
                  data-bind="value: endScale, valueUpdate: 'input'"
                />
                <input type="text" size="5" data-bind="value: endScale" />
              </td>
            </tr>

            <tr>
              <td>重力</td>
              <td>
                <input
                  type="range"
                  min="-20.0"
                  max="20.0"
                  step="1"
                  style="width: 140px"
                  data-bind="value: gravity, valueUpdate: 'input'"
                />
                <input type="text" size="5" data-bind="value: gravity" />
              </td>
            </tr>
            <tr>
              <td>放射类型</td>
              <td>
                <select class="cesium-button">
                  <option value="圆形放射" selected>圆形放射</option>
                  <option value="球体放射">球体放射</option>
                  <option value="圆锥体放射">圆锥体放射</option>
                  <option value="盒状放射">盒状放射</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
  </div>
</template>
<!--
怎么生成osg 模型  单体化   如何导入
压缩单节点
如何加载模型
载入模型
详情查看
发布服务
点击模型
单体化
房子详情
关联mysql
撒点
视口跟着车子跑 角度计算
例子  火焰燃烧
三维模型 加载方式
车子模型 上下
态势绘标  画一个方向 三位模型加线 路线图
可视区域分析
点击按钮 开启 关闭

厂房着火   车子启动 视口跟着车子移动  车子开启  车子启动到厂房 然后开始灭火

-->
<script>
import Cesium from "Cesium";
import { URL_CONFIG } from "../config/UrlConfig";
var viewModel = {
  emissionRate: 200.0,
  gravity: 0.0,
  minimumParticleLife: 1.5,
  maximumParticleLife: 1.8,
  minimumSpeed: 7.0,
  maximumSpeed: 9.0,
  startScale: 3.0,
  endScale: 1.5,
  particleSize: 2
};
let viewer, scene, widget;
export default {
  name: "Particle",
  data() {
    return {
      viewModel: {
        emissionRate: 200.0,
        gravity: 0.0,
        minimumParticleLife: 1.5,
        maximumParticleLife: 1.8,
        minimumSpeed: 7.0,
        maximumSpeed: 9.0,
        startScale: 3.0,
        endScale: 1.5,
        particleSize: 2
      }
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      let vm = this;
      viewer = new Cesium.Viewer("cesiumContainer");
      scene = viewer.scene;
      widget = viewer.cesiumWidget;
      var pos1 = Cesium.Cartesian3.fromDegrees(
        116.39079313032,
        39.9919830785419,
        0
      );
      var entity = viewer.entities.add({
        position: pos1
      });
      var promise = scene.open(URL_CONFIG.SCENE_OLYMPIC_NIGHT);
      Cesium.when(
        promise,
        function(layer) {
          //设置相机位置，定位至火炬模型
          scene.camera.setView({
            destination: new Cesium.Cartesian3(
              -2172428.9175560116,
              4377517.082359273,
              4099066.3961720997
            ),
            orientation: {
              heading: 5.296071416780919,
              pitch: -0.619256801382579,
              roll: 6.283185307179586
            }
          });
        },
        function() {
          var title = "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
          widget.showErrorPanel(title, undefined, e);
        }
      );

      var particleSystem = scene.primitives.add(
        new Cesium.ParticleSystem({
          image:
            "http://support.supermap.com.cn:8090/webgl/examples/images/ParticleSystem/fire.png",
          startColor: new Cesium.Color(1, 1, 1, 1),
          endColor: new Cesium.Color(1, 0, 0, 0),
          startScale: vm.viewModel.startScale,
          endScale: vm.viewModel.endScale,
          minimumParticleLife: vm.viewModel.minimumParticleLife,
          maximumParticleLife: vm.viewModel.maximumParticleLife,
          minimumSpeed: vm.viewModel.minimumSpeed,
          maximumSpeed: vm.viewModel.maximumSpeed,
          imageSize: new Cesium.Cartesian2(
            vm.viewModel.particleSize,
            vm.viewModel.particleSize
          ),
          emissionRate: vm.viewModel.emissionRate,
          lifetime: 6.0,
          //循环是否开启
          loop: true,
          emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),
          // emitterModelMatrix: computeEmitterModelMatrix(),
          // updateCallback: applyGravity,
          sizeInMeters: true
        })
      );
      // 设置粒子的坐标
      viewer.scene.preUpdate.addEventListener(function(scene, time) {
        console.log(
          scene,
          time,
          computeModelMatrix(entity, time),
          computeEmitterModelMatrix(),
          1111
        );
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

      //改变粒子系统的位置
      function computeEmitterModelMatrix() {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(0, 0, 86, translation);
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
        return Cesium.Matrix4.fromTranslationRotationScale(
          trs,
          emitterModelMatrix
        );
      }

      //控制粒子的姿态
      // Cesium.knockout.track(vm.viewModel);
      // var toolbar = document.getElementById("toolbar");
      // Cesium.knockout.applyBindings(vm.viewModel, toolbar);
      //
      // Cesium.knockout
      //   .getObservable(this.viewModel, "emissionRate")
      //   .subscribe(function(newValue) {
      //     particleSystem.emissionRate = parseFloat(newValue);
      //   });
      //
      // Cesium.knockout
      //   .getObservable(viewModel, "particleSize")
      //   .subscribe(function(newValue) {
      //     var particleSize = parseFloat(newValue);
      //     particleSystem.minimumImageSize.x = particleSize;
      //     particleSystem.minimumImageSize.y = particleSize;
      //     particleSystem.maximumImageSize.x = particleSize;
      //     particleSystem.maximumImageSize.y = particleSize;
      //   });
      //
      // Cesium.knockout
      //   .getObservable(this.viewModel, "minimumParticleLife")
      //   .subscribe(function(newValue) {
      //     particleSystem.minimumParticleLife = parseFloat(newValue);
      //   });
      //
      // Cesium.knockout
      //   .getObservable(this.viewModel, "maximumParticleLife")
      //   .subscribe(function(newValue) {
      //     particleSystem.maximumParticleLife = parseFloat(newValue);
      //   });
      //
      // Cesium.knockout
      //   .getObservable(this.viewModel, "minimumSpeed")
      //   .subscribe(function(newValue) {
      //     particleSystem.minimumSpeed = parseFloat(newValue);
      //   });
      //
      // Cesium.knockout
      //   .getObservable(this.viewModel, "maximumSpeed")
      //   .subscribe(function(newValue) {
      //     particleSystem.maximumSpeed = parseFloat(newValue);
      //   });
      //
      // Cesium.knockout
      //   .getObservable(this.viewModel, "startScale")
      //   .subscribe(function(newValue) {
      //     particleSystem.startScale = parseFloat(newValue);
      //   });
      //
      // Cesium.knockout
      //   .getObservable(this.viewModel, "endScale")
      //   .subscribe(function(newValue) {
      //     particleSystem.endScale = parseFloat(newValue);
      //   });
      this.$refs.loadingbar.remove();
      // $(".cesium-button").change(function() {
      //   var value = $(this).val();
      //   switch (value) {
      //     case "圆形放射":
      //       particleSystem.emitter = new Cesium.CircleEmitter(2.0);
      //       break;
      //     case "球体放射":
      //       particleSystem.emitter = new Cesium.SphereEmitter(2.5);
      //       break;
      //     case "圆锥体放射":
      //       particleSystem.emitter = new Cesium.ConeEmitter(
      //         Cesium.Math.toRadians(45.0)
      //       );
      //       break;
      //     case "盒状放射":
      //       particleSystem.emitter = new Cesium.BoxEmitter(
      //         new Cesium.Cartesian3(10.0, 10.0, 10.0)
      //       );
      //       break;
      //     default:
      //       break;
      //   }
      // });
    }
  }
};
</script>

<style scoped></style>
