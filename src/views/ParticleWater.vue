<template>
  <div class="water">
    <div id="cesiumContainer" class="fullSize"></div>
    <div id="loadingOverlay"><h1>Loading...</h1></div>
  </div>
</template>

<script>
export default {
  name: "ParticleWater",
  mounted() {
    this.load();
  },

  methods: {
    load() {
      var viewer = new Cesium.Viewer("cesiumContainer");
      //Set the random number seed for consistent results.
      Cesium.Math.setRandomNumberSeed(3);

      //Set bounds of our simulation time
      var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
      var stop = Cesium.JulianDate.addSeconds(
        start,
        120,
        new Cesium.JulianDate()
      );

      //Make sure viewer is at the desired time.
      viewer.clock.startTime = start.clone();
      viewer.clock.stopTime = stop.clone();
      viewer.clock.currentTime = start.clone();
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
      viewer.clock.multiplier = 1;
      viewer.clock.shouldAnimate = true;

      //Set timeline to simulation bounds
      // viewer.timeline.zoomTo(start, stop);

      var viewModel = {
        emissionRate: 5.0,
        gravity: 0.0,
        minimumParticleLife: 1.2,
        maximumParticleLife: 1.2,
        minimumSpeed: 1.0,
        maximumSpeed: 4.0,
        startScale: 1.0,
        endScale: 5.0,
        particleSize: 25.0
      };
      function computeModelMatrix(entity, time) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4());
      }
      var emitterModelMatrix = new Cesium.Matrix4();
      var translation = new Cesium.Cartesian3();
      var rotation = new Cesium.Quaternion();
      var hpr = new Cesium.HeadingPitchRoll();
      var trs = new Cesium.TranslationRotationScale();

      function computeEmitterModelMatrix() {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(
          -1.0,
          0.0,
          1.4,
          translation
        );
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

        return Cesium.Matrix4.fromTranslationRotationScale(
          trs,
          emitterModelMatrix
        );
      }
      var pos1 = Cesium.Cartesian3.fromDegrees(
        -75.15787310614596,
        39.97862668312678
      );
      var pos2 = Cesium.Cartesian3.fromDegrees(
        -75.1633691390455,
        39.95355089912078
      );
      var position = new Cesium.SampledPositionProperty();
      // /*
      //   * position. addSample 添加一个新样本。
      //   名称	类型	描述
      //   time		采样时间。
      //   position	笛卡尔3	在提供的时间的位置。
      //   derivatives	Array。< Cartesian3 >	可选在提供的时间的派生值数组
      //   * */
      position.addSample(start, pos2);
      position.addSample(stop, pos1);
      // 添加到位置参数
      var entity = viewer.entities.add({
        // availability: new Cesium.TimeIntervalCollection([
        //   new Cesium.TimeInterval({
        //     start: start,
        //     stop: stop
        //   })
        // ]),
        model: {
          uri:
            "http://support.supermap.com.cn:8090/webgl/examples/SampleData/models/Cesium_Ground.gltf",
          minimumPixelSize: 64
        },
        position: position,
        orientation: new Cesium.VelocityOrientationProperty(position)
      });
      viewer.trackedEntity = entity;

      var scene = viewer.scene;
      var particleSystem = viewer.scene.primitives.add(
        new Cesium.ParticleSystem({
          image:
            "http://support.supermap.com.cn:8090/webgl/examples/images/ParticleSystem/fountain2.png",
          imageSize: new Cesium.Cartesian2(20, 20), //粒子的大小由来控制imageSize。以随机的尺寸，控制与像素的宽度minimumImageSize.x和maximumImageSize.x和在之间的像素的高度minimumImageSize.y和maximumImageSize.y。
          startScale: 1.0, //可以使用startScale和endScale属性调整粒子的大小，以使其随时间增长或收缩。
          endScale: 4.0,
          particleLife: 1.0, //设置particleLife为5.0会将系统中的每个粒子设置为particleLife。要使每个粒子的输出随机化，请使用变量minimumParticleLife和maximumParticleLife。
          speed: 5.0, //速度由speed或通过minimumSpeed和maximumSpeed设置控制。
          //锥体发射器
          // ConeEmitter初始化圆锥体顶端的粒子，并以随机角度将它们引导出圆锥体。它采用单个float参数来指定圆锥角。锥体沿发射器的上轴定向
          emitter: new Cesium.CircleEmitter(0.5), //BoxEmitter在一个盒子内随机采样的位置初始化粒子，并将它们从六个盒子面之一中引出。它接受一个Cartesian3参数，该参数指定盒子的宽度，高度和深度尺寸。
          emissionRate: 5.0, //发射器每秒会产生一定数量的粒子，由参数指定，并根据发射器类型以随机速度初始化。
          modelMatrix: entity.computeModelMatrix(
            viewer.clock.startTime,
            new Cesium.Matrix4()
          ), //modelMatrix ：将粒子系统从模型转换为世界坐标。
          lifetime: 16.0 // 默认情况下，粒子系统将永远运行。要使粒子系统运行一定的持续时间，请使用lifetime以秒为单位指定持续时间并将其设置loop为false。
        })
      );

      viewer.scene.preUpdate.addEventListener(function(scene, time) {
        particleSystem.modelMatrix = computeModelMatrix(entity, time);
        // Account for any changes to the emitter model matrix.
        particleSystem.emitterModelMatrix = computeEmitterModelMatrix();
        // Spin the emitter if enabled.
        if (viewModel.spin) {
          viewModel.heading += 1.0;
          viewModel.pitch += 1.0;
          viewModel.roll += 1.0;
        }
      });
    }
  }
};
</script>

<style scoped></style>
