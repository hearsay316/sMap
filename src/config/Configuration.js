import Cesium from "Cesium";

/**
 *
 * @param idName
 * @returns {Cesium.Viewer}  idName div  id的值
 */
export function createCesium(idName) {
  const viewer = new Cesium.Viewer(idName);
  //const scene = viewer.scene;
  return viewer;
}

/**
 *
 * @param viewer  视图
 * @param MapFireXYZ 火的坐标 创建火元素
 * @param primitivesConfig 配置参数
 */
export function viewerMountedFire(viewer, MapFireXYZ, primitivesConfig) {
  let { x, y, z } = MapFireXYZ;
  var position = Cesium.Cartesian3.fromDegrees(x, y, z);
  console.log(viewer.entities);
  const FireEntity = viewer.entities.add({
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
      sizeInMeters: true,
      ...primitivesConfig
    })
  );
  viewer.scene.preUpdate.addEventListener(function(scene, time) {
    FireParticleSystem.modelMatrix = computeModelMatrix(FireEntity, time);
    // Account for any changes to the emitter model matrix.
    FireParticleSystem.emitterModelMatrix = computeEmitterModelMatrix();
  });
}
export function viewerEntitiesAdd(viewer, { x, y, z }, obj) {
  var position = Cesium.Cartesian3.fromDegrees(x, y, z);
  let ent = viewer.entities.add({
    model: {
      uri:
        "http://support.supermap.com.cn:8090/webgl/examples/SampleData/models/Cesium_Ground.gltf",
      minimumPixelSize: 32,
      maximumScale: 0.5
    },
    viewFrom: new Cesium.Cartesian3(x, y, z),
    position: position,
    ...obj
  });
  return ent;
}
/**
 *
 * @param scene
 * @param Config
 * @param url
 * @param dataSourceName
 * @param dataSetName
 * @param keyWord
 */
export function layer(
  scene,
  Config,
  { url, dataSourceName, dataSetName, keyWord }
) {
  layer = scene.layers.find(Config);
  //设置属性查询参数
  layer.setQueryParameter({
    url,
    dataSourceName,
    dataSetName,
    keyWord
  });
}

/**
 *
 * @param scene
 * @param url
 * @returns {Promise<unknown>}
 */
export function openMap(scene, url) {
  return new Promise((resolve, reject) => {
    try {
      //添加S3M图层服务
      let promise = scene.open(url);
      Cesium.when(
        promise,
        function(layers) {
          if (!scene.pickPositionSupported) {
            alert("不支持深度拾取,属性查询功能无法使用！");
          }
          // scene.layers获取当前场景的三维切片缓存图层集合。

          layer(scene, "Config", {
            url:
              "http://47.103.125.18:8090/iserver/services/data-userMap/rest/data",
            dataSourceName: "testMap",
            dataSetName: "New_Region",
            keyWord: "SmID"
          });
          resolve(layers);
        },
        function(e) {
          if (widget._showRenderLoopErrors) {
            let title = "渲染时发生错误，已停止渲染。";
            reject(title);
            widget.showErrorPanel(title, undefined, e);
          }
        }
      );
    } catch (e) {
      if (widget._showRenderLoopErrors) {
        let title = "渲染时发生错误，已停止渲染.";
        widget.showErrorPanel(title, undefined, e);
        reject(title);
      }
    }
  });
}

/**
 * 设置相机视角
 * @param scene
 * @param position
 * @param angle
 */
export function setView(scene, position, angle) {
  console.log(angle, position);
  if (Object.keys(position).length === 3 && Object.keys(angle).length === 3) {
    let { heading, pitch, roll } = angle;
    let { x, y, z } = position;
    scene.camera.setView({
      destination: new Cesium.Cartesian3(x, y, z),
      orientation: {
        heading,
        pitch,
        roll
      }
    });
    console.log(55555555555555555555);
  } else {
    throw new error("setView 参数不对");
  }
}

/**
 *
 * @param viewer
 * @param fuc   注册单体鼠标点击事件
 * @constructor
 */
export function CesiumClicklayer(viewer, fuc) {
  viewer.pickEvent.addEventListener(feature => {
    fuc(feature);
  });
}

/**
 *
 * @param scene
 * @param func  LEFT_CLICK canvas 点击事件
 * @constructor
 */
export function CesiumClickLeft(scene, func) {
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function(e) {
    let positions = scene.pickPosition(e.position);
    //将笛卡尔坐标转化为经纬度坐标
    let cartographic = Cesium.Cartographic.fromCartesian(positions);
    let x = Cesium.Math.toDegrees(cartographic.longitude);
    let y = Cesium.Math.toDegrees(cartographic.latitude);
    let z = cartographic.height;
    if (z < 0) {
      z = 0;
    }
    func(e, { x, y, z });
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 *
 * @param scene
 * @param func  RIGHT_CLICK canvas 右鼠标点击事件
 * @constructor
 */
export function CesiumClickRight(scene, func) {
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function(e) {
    func(e);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

function computeModelMatrix(entity, time) {
  return entity.computeModelMatrix(time, new Cesium.Matrix4());
}
// 改变粒子系统的位置
function computeEmitterModelMatrix() {
  let emitterModelMatrix = new Cesium.Matrix4();
  let translation = new Cesium.Cartesian3();
  let rotation = new Cesium.Quaternion();
  let hpr = new Cesium.HeadingPitchRoll();
  let trs = new Cesium.TranslationRotationScale();
  hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
  trs.translation = Cesium.Cartesian3.fromElements(-2, 0, 2, translation);
  trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
  return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
}
