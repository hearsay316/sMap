import Cesium from "Cesium";
/*本文件封装了Cesium 超图的测量方法*/
/**
 *
 * @param viewer   测量距离
 * @param measureEvt
 * @param activeEvt
 * @returns {Cesium.MeasureHandler}
 * @constructor
 */
export function CesiumHandlerDis(viewer,measureEvt,activeEvt) {
    let clampMode = 0;
    //初始化测量距离
    const handlerDis = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.Distance,
        clampMode
    );
    //注册测距功能事件
    handlerDis.measureEvt.addEventListener(function(result) {
        measureEvt(result,handlerDis)
    });
    handlerDis.activeEvt.addEventListener(function(isActive) {
        activeEvt(isActive,handlerDis)

    });
    return handlerDis;
}
export function CesiumHandlerHeight(viewer, measureEvt,activeEvt) {
    //初始化测量高度
   const handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH);
    handlerHeight.measureEvt.addEventListener(function(result) {
        measureEvt(result,handlerHeight)
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
        activeEvt(isActive,handlerHeight)
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
    });
    return handlerHeight
}
export function CesiumHandlerArea(viewer, measureEvt,activeEvt) {
    let clampMode = 0;
    //初始化测量面积
    const handlerArea = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.Area,
        clampMode
    );
    handlerArea.measureEvt.addEventListener(function(result) {
        measureEvt(result,handlerArea)
        let mj = Number(result.area);
        let area =
            mj > 1000000
                ? (mj / 1000000).toFixed(2) + "km²"
                : mj.toFixed(2) + "㎡";
        handlerArea.areaLabel.text = "面积:" + area;
    });
    handlerArea.activeEvt.addEventListener(function(isActive) {
        activeEvt(isActive,handlerArea)
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
    });
    return  handlerArea
}