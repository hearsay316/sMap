import Cesium from "Cesium";
export function createCesium(idName) {
  const viewer = new Cesium.Viewer(idName);
  const scene = viewer.scene;
  return viewer;
}
/*
*   layer = scene.layers.find("Config");
                    //设置属性查询参数
                    layer.setQueryParameter({
                        url:
                            "http://47.103.125.18:8090/iserver/services/data-userMap/rest/data",
                        dataSourceName: "testMap",
                        dataSetName: "New_Region",
                        keyWord: "SmID"
                    });
*
*
* */
/*
*   url:
            "http://47.103.125.18:8090/iserver/services/data-userMap/rest/data",
        dataSourceName: "testMap",
        dataSetName: "New_Region",
        keyWord: "SmID"
* */
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
          resolve(layers);
          // scene.layers获取当前场景的三维切片缓存图层集合。
          layer(scene, "Config", {
            url:
              "http://47.103.125.18:8090/iserver/services/data-userMap/rest/data",
            dataSourceName: "testMap",
            dataSetName: "New_Region",
            keyWord: "SmID"
          });
          //设置相机视角
          setView(
            scene,
            {
              x: -20183889.354184173,
              y: 22645826.766457584,
              z: 3223367.6070640916
            },
            {
              heading: 5.662887035643514,
              pitch: -1.4213836938199456,
              roll: 9.769962616701378e-14
            }
          );
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
/*
*
*  -20183889.354184173,
            22645826.766457584,
            3223367.6070640916
* */
/*
*
* heading: 5.662887035643514,
            pitch: -1.4213836938199456,
            roll: 9.769962616701378e-14
* */
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
  } else {
    throw new error("setView 参数不对");
  }
}
//
export function handlerDis() {}
// 注册单体鼠标点击事件
export function xxx(viewer, fuc) {
  viewer.pickEvent.addEventListener(feature => {
    fuc(feature);
  });
}

// LEFT_CLICK canvas 点击事件
export function CesiumClickLeft(scene, func) {
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function(e) {
    func(e);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
// RIGHT_CLICK canvas 点击事件
/**
 *
 * @param scene
 * @param func
 * @constructor
 */
export function CesiumClickRight(scene, func) {
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function(e) {
    func(e);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
