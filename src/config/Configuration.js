import Cesium from "Cesium";
export function createCesium(idName) {
  const viewer = new Cesium.Viewer(idName);
  const scene = viewer.scene;
  return viewer;
}
export function ff(Cesium) {
  try {
    //添加S3M图层服务
    let promise = scene.open(
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
        //设置相机视角
        scene.camera.setView({
          destination: new Cesium.Cartesian3(
            -20183889.354184173,
            22645826.766457584,
            3223367.6070640916
          ),
          orientation: {
            heading: 5.662887035643514,
            pitch: -1.4213836938199456,
            roll: 9.769962616701378e-14
          }
        });
      },
      function(e) {
        if (widget._showRenderLoopErrors) {
          let title = "渲染时发生错误，已停止渲染。";
          widget.showErrorPanel(title, undefined, e);
        }
      }
    );
  } catch (e) {
    if (widget._showRenderLoopErrors) {
      let title = "渲染时发生错误，已停止渲染.";
      widget.showErrorPanel(title, undefined, e);
    }
  }
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
export function setView(scene, position,angle) {
    console.log(angle,position)
    if(Object.keys(position).length===3&&Object.keys(angle).length===3){
        let { heading, pitch, roll } = angle;
        let {x,y,z} = position
        scene.camera.setView({
            destination: new Cesium.Cartesian3(x, y, z),
            orientation: {
                heading,
                pitch,
                roll
            }
        });
    }else {
        throw new error("setView 参数不对")
    }

}
