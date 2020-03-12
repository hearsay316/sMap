<template>
    <div class="rvt">
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>
    let viewer,scene;
    import * as map from "../config/Configuration"
    export default {
        name: "rvt图层",
        async mounted(){
            viewer =  this.createCesium("cesiumContainer");
            scene = viewer.scene;
            console.log(2225)
         //  await this.openMap(scene,"http://47.103.125.18:8090/iserver/services/3D-tempWorkspace_1/rest/realspace");
            try {
                //添加S3M图层服务
                var promise = scene.addS3MTilesLayerByScp("http://47.103.125.18:8090/iserver/services/3D-tempWorkspace_1/rest/realspace",{
                    name:"Test"
                });
                console.log(2225)
                Cesium.when(
                    promise,
                    function(layers) {
                        console.log(layers)
                        if (!scene.pickPositionSupported) {
                            alert("不支持深度拾取,属性查询功能无法使用！");
                        }
                        console.log(2225)
                        //设置相机视角
                        scene.camera.setView({
                            destination: Cesium.Cartesian3.fromDegrees(
                              0,
                               0,
                                0
                            ),
                            orientation: {
                                heading: 5.662887035643514,
                                pitch: -1.4213836938199456,
                                roll: 9.769962616701378e-14
                            }
                        });
                    },
                    function(e) {
                        console.log(e)
                        if (widget._showRenderLoopErrors) {
                            var title = "渲染时发生错误，已停止渲染。";
                            widget.showErrorPanel(title, undefined, e);
                        }
                    }
                );
            } catch (e) {
                if (widget._showRenderLoopErrors) {
                    var title = "渲染时发生错误，已停止渲染.";
                    widget.showErrorPanel(title, undefined, e);
                }
            }
        },
        methods:{
            ...map,
        }
    }
</script>

<style scoped>

</style>