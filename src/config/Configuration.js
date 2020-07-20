// import Cesium from "Cesium";
// import initPlotPanel from "initPlotPanel";
// import StylePanel from "StylePanel";
// let urlData = {
//   inputLink: [
//     "colorpicker/css/colorpicker.css",
//     "colorpicker/css/layout.css",
//     "jquery-easyui-1.4.4/css/easyui.css",
//     "zTree/css/zTreeStyle.css"
//   ],
//   inputScript: [
//     "jquery-easyui-1.4.4/jquery.min.js",
//     "jquery-easyui-1.4.4/jquery-ui.js",
//     "jquery-easyui-1.4.4/jquery.easyui.min.js",
//     "colorpicker/js/colorpicker.js",
//     "colorpicker/js/colorpickerEditor.js",
//     "colorpicker/js/eye.js",
//     "colorpicker/js/utils.js",
//     "colorpicker/js/layout.js",
//     "zTree/jquery.ztree.core.js",
//     "./StylePanel.js",
//     "./PlotPanel.js"
//   ]
// };
// urlData.inputLink.forEach(item => {
//   var link =
//     "<" +
//     'link rel="stylesheet" type="text/css" media="screen,projection" href="webgl/examples/js/plotPanelControl/' +
//     item +
//     '"' +
//     "><" +
//     "/>";
//   document.writeln(link);
// });
// urlData.inputScript.forEach(item => {
//   var script =
//     "<" +
//     'script type="text/javascript" src="webgl/examples/js/plotPanelControl/' +
//     item +
//     '"' +
//     "><" +
//     "/script>";
//   document.writeln(script);
// });

/**
 * 创建Cesium 实例
 * @param idName
 * @returns {Cesium.Viewer}  idName div  id的值
 */
export function createCesium(idName, Cesium) {
  return new Cesium.Viewer(idName);
}
//todo 需要重构
/**
 * 移动相机 坐标
 * @param scene
 */
function lookFire(scene, Cesium) {
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
}

/**
 * 创建动态标绘 (动态标绘 只能隐藏 不能销毁)
 * @param viewer
 * @param serverUrl
 * @returns {{plottingLayer: Cesium.PlottingLayer, plotDrawControl: Cesium.PlotDrawControl, plotting: (*|module:zrender/ZRender), plotEditControl: Cesium.PlotEditControl, stylePanel}}
 * @constructor
 */
export function InitPlot(viewer, serverUrl, Cesium) {
  console.log("InitPlot 动态标绘开始");
  if (!viewer) {
    return;
  }
  // 挂在全局方法
  let scene = viewer.scene;
  window.scene = scene;
  const plottingLayer = new Cesium.PlottingLayer(scene, "plottingLayer");
  scene.layers.add(plottingLayer);
  const plotEditControl = new Cesium.PlotEditControl(scene, plottingLayer); //编辑控件
  window.plotEditControl = plotEditControl;
  const plotDrawControl = new Cesium.PlotDrawControl(scene, plottingLayer); //绘制控件
  plotDrawControl.drawFinishEvent.addEventListener(function() {
    //标绘结束，激活编辑控件
    plotEditControl.activate();
  });

  const plotting = Cesium.Plotting.getInstance(serverUrl, scene);
  const stylePanel = new StylePanel("stylePanel", plotEditControl, plotting);
  // 标绘面板
  initPlotPanel(
    "plotPanel",
    serverUrl,
    plotDrawControl,
    plotEditControl,
    plotting
  );
  window.scene = undefined;
  window.plotEditControl = undefined;
  window.StylePanel = undefined;
  window.initPlotPanel = undefined;
  // 清除window作用域
  console.log("InitPlot 动态标绘结束");

  return {
    plottingLayer,
    plotEditControl,
    plotDrawControl,
    plotting,
    stylePanel
  };
}

/**
 * 创建水的效果
 * @param viewer
 * @param cart
 * @param Fire
 * @param Cesium
 * @returns {*}
 */
export function viewerMountedWater(viewer, cart, Fire, Cesium) {
  let scene = viewer.scene;
  let emitterModelMatrix = new Cesium.Matrix4();
  let translation = new Cesium.Cartesian3();
  let rotation = new Cesium.Quaternion();
  let hpr = new Cesium.HeadingPitchRoll();
  let trs = new Cesium.TranslationRotationScale();
  let entity = cart;
  let viewModel = {
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

  scene.logarithmicDepthBuffer = false;
  //关闭HDR
  scene.highDynamicRange = false;
  let WaterParticleSystem = viewer.scene.primitives.add(
    new Cesium.ParticleSystem({
      image: "http://cdn.j6375x.cn/cdn/pic/fountain2.png",
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
  viewer.scene.preUpdate.addEventListener(function(scene, time) {
    WaterParticleSystem.modelMatrix = computeModelMatrix(entity, time);
    // Account for any changes to the emitter model matrix.
    WaterParticleSystem.emitterModelMatrix = computeEmitterModelMatrix();
  });
  // this.HandleS3DestroyedFire();

  function computeModelMatrix(entity, time) {
    return entity.computeModelMatrix(time, new Cesium.Matrix4());
  }

  // 改变粒子系统的位置
  function computeEmitterModelMatrix() {
    hpr = Cesium.HeadingPitchRoll.fromDegrees(0, 90, 195, hpr); //方向坐标
    trs.translation = Cesium.Cartesian3.fromElements(0, 0, 1.4, translation); //位置高度
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
    return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
  }
  return WaterParticleSystem;
}

/**
 *  灭火
 * @param viewer
 * @param FireParticleSystem 火的实例
 * @param FireEntity  火的实例
 * @param WaterParticleSystems 水的实力
 * @returns {Promise<unknown>}
 */
export function viewerDestroyedFire(
  viewer,
  { FireParticleSystem, FireEntity },
  WaterParticleSystems
) {
  return new Promise((resolve, reject) => {
    let index = 1;
    let time = setInterval(() => {
      if (index <= 0) {
        clearInterval(time);
        viewer.entities.remove(FireEntity);
        viewer.scene.primitives.remove(FireParticleSystem);
        let remove = WaterParticleSystems.map(WaterParticleSystem => {
          return viewer.scene.primitives.remove(WaterParticleSystem);
        });
        let isTrue = remove.every(item => item) && remove.length > 0;
        isTrue ? resolve(isTrue) : reject(false);
        // this.$confirm("灭火成功,演示完毕", "提示", {
        //   type: "success",
        //   showCancelButton: false,
        //   showConfirmButton: false,
        //   showClose: false
        // });
      }
      index -= 0.025;
      var particleSize = parseFloat(index);
      FireParticleSystem.minimumImageSize.x = particleSize;
      FireParticleSystem.minimumImageSize.y = particleSize;
      FireParticleSystem.maximumImageSize.x = particleSize;
      FireParticleSystem.maximumImageSize.y = particleSize;
    }, 400);
  });
}

/**
 *
 * @param viewer
 * @param MapFireXYZ
 * @param positionXYZ
 * @param carts
 * @param Fire
 * @returns {Promise<unknown>}
 */
export function viewerCreateFireFighting(
  viewer,
  MapFireXYZ,
  positionXYZ,
  carts,
  Fire,
  Cesium
) {
  console.log(viewer, MapFireXYZ, positionXYZ, carts);
  return new Promise((resolve, reject) => {
    let { x, y, z } = MapFireXYZ;
    // let { x: x1, y: y1, z: z1 } = positionXYZ[0];
    // let { x: x2, y: y2, z: z2 } = positionXYZ[1];
    // let { x: x3, y: y3, z: z3 } = positionXYZ[2];
    let [
      { x: x1, y: y1, z: z1 },
      { x: x2, y: y2, z: z2 },
      { x: x3, y: y3, z: z3 }
    ] = positionXYZ;
    let index = 500;
    let addx = (x - x1) / index;
    let addy = (y - y1) / index;
    let addz = (z - z1) / index;
    // let cart1 = carts[0];
    // let cart2 = carts[1];
    // let cart3 = carts[2];
    let [cart1, cart2, cart3] = carts;
    let time = setInterval(() => {
      if (index === 100) {
        clearInterval(time);
        let Waters = carts.map(cart => {
          return viewerMountedWater(viewer, cart, Fire, Cesium);
        });
        lookFire(viewer.scene, Cesium);
        viewerDestroyedFire(viewer, Fire, Waters)
          .then(res => {
            resolve(res);
          })
          .catch(error => reject(error));
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
      cart1.position = Cesium.Cartesian3.fromDegrees(x1, y1, z1);
      cart2.position = Cesium.Cartesian3.fromDegrees(x2, y2, z2);
      cart3.position = Cesium.Cartesian3.fromDegrees(x3, y3, z3);
      --index;
    }, 0);
  });
}

/**
 *
 * @param viewer 创建小车
 * @param positionXYZ 坐标
 * @returns {[]}  返回创建小车的实例  (用来销毁小车)
 */
export function viewerMountedDeployCart(viewer, positionXYZ, Cesium) {
  console.log("viewerMountedDeployCart 开始创建小车");
  let userCarts = [];
  positionXYZ.forEach(xyz => {
    let { x, y, z, name } = xyz;
    var position = Cesium.Cartesian3.fromDegrees(x, y, z);
    let cart = viewer.entities.add({
      name: name,
      model: {
        uri: "./webgl/models/Cesium_Ground.gltf",
        minimumPixelSize: 32,
        maximumScale: 0.5
      },
      viewFrom: new Cesium.Cartesian3(x, y, z),
      position: position,
      orientation: Cesium.Transforms.headingPitchRollQuaternion(
        position,
        new Cesium.HeadingPitchRoll(60 / 10, 0, 0)
      )
    });
    userCarts.push(cart);
  });
  console.log(userCarts);
  console.log("viewerMountedDeployCart 小车结束");

  return userCarts;
}
/**
 *
 * @param viewer  视图
 * @param MapFireXYZ 火的坐标 创建火元素
 * @param Cesium Cesium 实例
 * @param primitivesConfig 配置参数
 */
export function viewerMountedFire(
  viewer,
  MapFireXYZ,
  Cesium,
  primitivesConfig
) {
  console.log("viewerMountedFire 开始创建火");
  ArgumentsError("viewerMountedFire", ...arguments);
  let { x, y, z } = MapFireXYZ;
  const scene = viewer.scene;
  const position = Cesium.Cartesian3.fromDegrees(x, y, z);
  const FireEntity = viewer.entities.add({
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
  // var origin = Cesium.Cartesian3.fromDegrees(x, y, z);
  // var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin);

  const FireParticleSystem = scene.primitives.add(
    new Cesium.ParticleSystem({
      id: "xxx",
      // 粒子的图片
      image: "http://cdn.j6375x.cn/cdn/pic/fire.png",
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
    FireParticleSystem.emitterModelMatrix = computeEmitterModelMatrix(Cesium);
  });
  console.log("viewerMountedFire 创建火完毕");

  return { FireParticleSystem, FireEntity };
}

/**
 * 创建物体实例
 * @param viewer
 * @param url  "http://support.supermap.com.cn:8090/webgl/examples/SampleData/models/Cesium_Ground.gltf"
 * @param x
 * @param y
 * @param z
 * @param obj
 * @returns {*}
 */
export function viewerEntitiesAdd(viewer, { x, y, z }, obj, Cesium) {
  var position = Cesium.Cartesian3.fromDegrees(x, y, z);
  return viewer.entities.add({
    ...obj,
    position: position
  });
}
function error(desc) {
  console.error(desc);
}
/**
 * 注册点击单体化
 * @param layers
 * @param config
 */
export function observeLayer(layers, config, Cesium) {
  let { name, setQueryParameter } = config;
  !Array.isArray(layers) && error("layers 不是数组");
  const layer = layers.find(layer => layer.name === name);
  !layer && error("layer 没有,config.name 找不到");
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
 * @param Cesium
 */
export function openMap(obj, Cesium) {
  let { viewer, url, config, earth, mountedOpenMap, errorOpenMap } = obj;
  const { positionXYZ, orientation } = earth;
  const scene = viewer.scene;
  const widget = viewer.cesiumWidget;
  return new Promise((resolve, reject) => {
    try {
      //添加S3M图层服务
      let promise = scene.open(url);
      Cesium.when(
        promise,
        function(layers) {
          console.log("openMap 开始");
          if (!scene.pickPositionSupported) {
            alert("不支持深度拾取,属性查询功能无法使用！");
          }
          // scene.layers获取当前场景的三维切片缓存图层集合。
          //   layer = scene.layers.find(config);
          //   console.log(layers.find(layer => layer.name === config));
          //   console.log(layer,layers,layer===layers[0])
          // layer(scene, "Test", {
          //   url:
          //     "https://www.huaitaos.com:8443/iserver/services/data-userMap/rest/data",
          //   dataSourceName: "testMap",
          //   dataSetName: "New_Region",
          //   keyWord: "SmID"
          // });
          const ConfigName = config && config.name;
          ConfigName && observeLayer(layers, config, Cesium);
          const positionConfig = positionXYZ && orientation;
          positionConfig &&
            setViewConfig(viewer, positionXYZ, orientation, Cesium);
          mountedOpenMap && mountedOpenMap(viewer, layers, Cesium);

          resolve(layers);
          console.log("openMap 结束");
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
//todo 需要重构
/**
 * setViewConfig 逻辑需要重写
 * @param viewer
 * @param positionXYZ
 * @param orientation
 * @param Cesium
 */
export function setViewConfig(viewer, positionXYZ, orientation, Cesium) {
  console.log("setViewConfig 开始");
  let { x, y, z } = positionXYZ;
  let { heading, pitch, roll } = orientation;
  setView(
    viewer.scene,
    { x, y, z },
    {
      heading,
      pitch,
      roll
    },
    Cesium
  );
  console.log("setViewConfig 结束");
}
/**
 * 设置相机视角
 * @param scene
 * @param position
 * @param angle
 * @param Cesium
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
export function setView(scene, position, angle, Cesium) {
  console.log("setView 开始");
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
    console.log("setView 结束");
  } else {
    throw new error("setView 参数不对");
  }
}
export function setPositionView(scene, position, Cesium) {
  console.log("setView 开始");
  if (Object.keys(position).length === 3 && Object.keys(angle).length === 3) {
    let { x, y, z } = position;
    scene.camera.setView({
      destination: new Cesium.Cartesian3(x, y, z)
    });
    console.log("setView 结束");
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
  try {
    viewer.pickEvent.addEventListener(feature => {
      console.log("CesiumClickLayer 执行了");
      fuc(feature);
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 *
 * @param scene
 * @param func  LEFT_CLICK canvas 点击事件
 * @constructor
 */
export function CesiumClickLeft(scene, func, Cesium) {
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function(e) {
    /**
     *  点击物体事件触发
     */
    const pick = scene.pick(e.position);
    if (Cesium.defined(pick)) {
      // 点击物体事件触发
      let primitiveInfo = pick.primitive;
      // console.log(
      //   "pick.primitive",
      //   pick.primitive,
      //   pick.primitive?._collection?._textureAtlasGUID
      // );
      // scene.primitives._primitives.forEach(item => {
      //   console.log(item?._billboardCollection?._textureAtlasGUID);
      // });
    }
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
    // window.scene = scene;
    // console.log(scene.camera, scene.Cartesian3);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 *
 * @param scene
 * @param func  RIGHT_CLICK canvas 右鼠标点击事件
 * @constructor
 */
export function CesiumClickRight(scene, func, Cesium) {
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

/**
 *
 * @param clampMode 初始化测量距离
 */
export function viewerHandlerDis(
  viewer,
  clampMode,
  superMeasureData,
  index,
  Cesium
) {
  // let vm = this;
  //初始化测量距离
  console.log("viewerHandlerDis初始化测量距离");
  const handlerDis = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.Distance,
    clampMode
  );
  //注册测距功能事件
  handlerDis.measureEvt.addEventListener(function(result) {
    // console.log(result);
    let dis = Number(result.distance);
    let distance =
      dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
    handlerDis.disLabel.text = "距离:" + distance;
  });
  console.log("viewerHandlerDis");
  handlerDis.activeEvt.addEventListener(function(isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = "";
      $("body")
        .removeClass("measureCur")
        .addClass("measureCur");
    } else {
      //  vm.demo3MenuDistance = false;
      superMeasureData.MeasuringConfig[index].active = 0;
      viewer.enableCursorStyle = true;
      $("body").removeClass("measureCur");
    }
  });
  console.log("viewerHandlerDis结束");
  return handlerDis;
}

/**
 *
 * @param viewer
 * @param clampMode//初始化测量面积
 * @param superMeasureData
 * @param index
 * @param Cesium
 */
export function viewerHandlerArea(
  viewer,
  clampMode,
  superMeasureData,
  index,
  Cesium
) {
  console.log("viewerHandlerArea 开始");
  // let vm = this;
  //初始化测量面积
  const handlerArea = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.Area,
    clampMode
  );
  handlerArea.measureEvt.addEventListener(function(result) {
    let mj = Number(result.area);
    let area =
      mj > 1000000 ? (mj / 1000000).toFixed(2) + "km²" : mj.toFixed(2) + "㎡";
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
      superMeasureData.MeasuringConfig[index].active = false;
      viewer.enableCursorStyle = true;
      $("body").removeClass("measureCur");
    }
  });
  console.log("viewerHandlerArea 结束");
  return handlerArea;
}

/**
 *  高 Height
 * @param viewer
 * @param clampMode
 * @param superMeasureData
 * @param index
 * @returns {Cesium.MeasureHandler}
 */
export function viewerHandlerHeight(
  viewer,
  clampMode,
  superMeasureData,
  index,
  Cesium
) {
  console.log("viewerHandlerHeight 开始 ");
  // let vm = this;
  //初始化测量高度
  const handlerHeight = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.DVH
  );
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
      superMeasureData.MeasuringConfig[index].active = false;
      console.log("superMeasureData.MeasuringConfig[index].active");
      viewer.enableCursorStyle = true;
      $("body").removeClass("measureCur");
    }
  });
  console.log("viewerHandlerHeight 结束 ");

  return handlerHeight;
}
// 改变粒子系统的位置
function computeEmitterModelMatrix(Cesium) {
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
        uri: "./webgl/models/Cesium_Ground.gltf",
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
function ArgumentsError(funName, ...arg) {
  console.log(arguments);
  for (let index of arg.keys()) {
    !arg[index] && console.error(`${funName}的第${index + 1}个参数为空`);
  }
}
