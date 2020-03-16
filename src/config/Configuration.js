import Cesium from "Cesium";

/**
 *
 * @param idName
 * @returns {Cesium.Viewer}  idName div  id的值
 */
export function createCesium(idName) {
  const viewer = new Cesium.Viewer(idName);
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
  let entitie = viewer.entities.add({
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
  return entitie;
}
/**
 *
 * @param layers
 * @param Config
 */
export function observeLayer(layers, Config) {
  let { name, setQueryParameter } = Config;
  const layer = layers.find(layer => layer.name === name);
  let data = {
    keyWord: "SmID",
    ...setQueryParameter
  };
  // setQueryParameter 设置属性查询参数
  //      Name	        Type	  Default    Description
  //      options	        Object	             对象具有以下属性：
  //      Name	        Type		         Description
  //      url	String		optional             数据服务url。
  //      dataSourceName	String		         optional数据源名称。
  //      dataSetName	    String		         optional数据集名称。
  //      isMerge	        Boolean		         optional该图层是否为合并数据集的，如果是则不用指定数据集名称。
  //      hasGeometry	    Boolean	    false	 optional属性查询返回结果是否包含几何信息。
  try {
    layer && layer.setQueryParameter(data);
  } catch (e) {
    console.log(e);
  }
}

/**
 *
 * @returns {Promise<unknown>}
 * @param obj
 */
export function openMap(obj) {
  let {
    viewer,
    url,
    Config,
    positionXYZ,
    Angle,
    mountedOpenMap,
    errorOpenMap
  } = obj;
  const scene = viewer.scene;
  const widget = viewer.cesiumWidget;
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
          //   layer = scene.layers.find(Config);
          //   console.log(layers.find(layer => layer.name === Config));
          //   console.log(layer,layers,layer===layers[0])
          // layer(scene, "Test", {
          //   url:
          //     "http://47.103.125.18:8090/iserver/services/data-userMap/rest/data",
          //   dataSourceName: "testMap",
          //   dataSetName: "New_Region",
          //   keyWord: "SmID"
          // });

          let { name } = Config;
          name && observeLayer(layers, Config);

          // let layer = viewer.scene.layers.find(Config);
          // const sceneLayer = layer;
          console.log(666555);
          let { x, y, z } = positionXYZ;
          let { heading, pitch, roll } = Angle;
          setView(
            viewer.scene,
            { x, y, z },
            {
              heading,
              pitch,
              roll
            }
          );
          mountedOpenMap && mountedOpenMap(viewer, layers);
          resolve(layers);
        },
        function(e) {
          errorOpenMap && errorOpenMap(e);
          if (widget._showRenderLoopErrors) {
            let title = "渲染时发生错误，已停止渲染。";
            reject(title);
            widget.showErrorPanel(title, undefined, e);
          }
        }
      );
    } catch (e) {
      errorOpenMap && errorOpenMap();
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
//设置相机位置，定位至模型
// scene.camera.setView({
//     //将经度、纬度、高度的坐标转换为笛卡尔坐标 -2653915.6463913363,3571045.726807149,4570293.566342328
//     destination : new Cesium.Cartesian3(x,y,z),
//     orientation : {
//         heading ,
//         pitch ,
//         roll
//     }
// });
export function setView(scene, position, angle) {
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
export function CesiumClickLayer(viewer, fuc) {
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
export function MountedMapCart(viewer, positionXYZ, length) {
  let { x, y, z } = position;
  /*
  102.06811287312502 24.97216506413337 1569.1730185409224
demo3.vue?451f:999 O {_scene: St, _transform: u, _invTransform: u, _actualTransform: u, _actualInvTransform: u, …} undefined
demo3.vue?451f:1012 102.06814093688459 24.972130263176506 1569.1964102705317
demo3.vue?451f:999 O {_scene: St, _transform: u, _invTransform: u, _actualTransform: u, _actualInvTransform: u, …} undefined
demo3.vue?451f:1012 102.06816550169316 24.97209762824952 1569.1852240472342
  */
  const userX = 0.000028063759572205527;
  const userY = -0.00003480095686470008;
  const userZ = 0.02339172960932956;
  const arrA = [];
  for (let i = 0; i < length; i++) {
    arrA.push({
      x: i * userX + x,
      y: i * userY + y,
      z: i * userZ + z
    });
  }
  // let arr = [
  //     {
  //         x: x - userX,
  //         y: y - userY,
  //         z: z - userZ
  //     },
  //     {
  //         x,
  //         y,
  //         z
  //     },
  //     {
  //         x: x + userX,
  //         y: y + userY,
  //         z: z + userZ
  //     }
  // ];

  arrA.forEach(item => {
    let { x, y, z } = item;
    const position = Cesium.Cartesian3.fromDegrees(x, y, z);
    cart = viewer.entities.add({
      model: {
        uri:
          "http://support.supermap.com.cn:8090/webgl/examples/SampleData/models/Cesium_Ground.gltf",
        minimumPixelSize: 32
      },
      viewFrom: new Cesium.Cartesian3(x, y, z),
      position: position,
      orientation: Cesium.Transforms.headingPitchRollQuaternion(
        position,
        new Cesium.HeadingPitchRoll(26 / 10, 0, 0)
      )
    });
    isCarts.push(cart);
  });
}
