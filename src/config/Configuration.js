import Cesium from "Cesium";

/**
 *
 * @param idName
 * @returns {Cesium.Viewer}
 */
export function createCesium(idName) {
  const viewer = new Cesium.Viewer(idName);
  const scene = viewer.scene;
  return viewer;
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
      console.log(55555555555555555555)
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
    func(e,{x, y, z});
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 *
 * @param scene
 * @param func  RIGHT_CLICK canvas 点击事件
 * @constructor
 */
export function CesiumClickRight(scene, func) {
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function(e) {
    func(e);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
