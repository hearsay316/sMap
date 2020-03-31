import Cesium from "Cesium";
/*本文件封装了Cesium 超图的测量方法 返回值带有 activate();是调用开始  clear()清除*/
/**
 *
 * @param viewer   测量距离
 * @param measureEvt
 * @param activeEvt
 * @returns {Cesium.MeasureHandler}
 * @constructor
 */
export function CesiumHandlerDis(viewer, measureEvt, activeEvt) {
  let clampMode = 0;
  //初始化测量距离
  const handlerDis = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.Distance,
    clampMode
  );
  //注册测距功能事件
  handlerDis.measureEvt.addEventListener(function(result) {
    let dis = Number(result.distance);
    let distance =
      dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
    handlerDis.disLabel.text = "距离:" + distance;
    typeof measureEvt === "function" && measureEvt(result, handlerDis);
  });
  handlerDis.activeEvt.addEventListener(function(isActive) {
    if (isActive == true) {
      // viewer.enableCursorStyle鼠标在绘制的时候变为十字
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = "";
      $("body")
        .removeClass("measureCur")
        .addClass("measureCur");
    } else {
      viewer.enableCursorStyle = true;
      $("body").removeClass("measureCur");
    }
    typeof activeEvt === "function" && activeEvt(isActive, handlerDis);
  });
  return handlerDis;
}
export function CesiumHandlerHeight(viewer, measureEvt, activeEvt) {
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
    typeof measureEvt === "function" && measureEvt(result, handlerHeight);
  });
  handlerHeight.activeEvt.addEventListener(function(isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = "";
      $("body")
        .removeClass("measureCur")
        .addClass("measureCur");
    } else {
      viewer.enableCursorStyle = true;
      $("body").removeClass("measureCur");
    }
    typeof activeEvt === "function" && activeEvt(isActive, handlerHeight);
  });
  return handlerHeight;
}
export function CesiumHandlerArea(viewer, measureEvt, activeEvt) {
  let clampMode = 0;
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
    typeof measureEvt === "function" && measureEvt(result, handlerArea);
  });
  handlerArea.activeEvt.addEventListener(function(isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = "";
      $("body")
        .removeClass("measureCur")
        .addClass("measureCur");
    } else {
      viewer.enableCursorStyle = true;
      $("body").removeClass("measureCur");
    }
    typeof activeEvt === "function" && activeEvt(isActive, handlerArea);
  });
  return handlerArea;
}
