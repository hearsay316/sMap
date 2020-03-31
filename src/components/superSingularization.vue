<template>
  <div class="superSingularization">
    <div class="superSingularization-main">
      <div class="superSingularization-main-desc">
        <div class="superSingularization-main-desc-item">
          <div class="superSingularization-main-desc-item-img">
            <img :src="superSingularizationData.titleImg" alt="" />
          </div>
          <div class="superSingularization-main-desc-item-title">
            {{ superSingularizationData.title }}
          </div>
        </div>
        <div class="superSingularization-main-desc-item">
          <div class="superSingularization-main-desc-item-img">
            <img :src="superSingularizationData.descImg" alt="" />
          </div>
          <div class="superSingularization-main-desc-item-title">
            {{ superSingularizationData.desc }}
          </div>
        </div>
        <div class="superSingularization-main-desc-item">
          <div class="superSingularization-main-desc-item-img">
            <img :src="superSingularizationData.FeaturesImg" alt="" />
          </div>
          <div class="superSingularization-main-desc-item-title">
            {{ superSingularizationData.features }}
          </div>
        </div>
      </div>
      <img
        class="superSingularization-main-top"
        src="../assets/superSingularization/01.png"
        alt=""
      />
      <img
        class="superSingularization-main-right"
        src="../assets/superSingularization/02.png"
        alt=""
      />
      <img
        class="superSingularization-main-bottom"
        src="../assets/superSingularization/03.png"
        alt=""
      />
      <img
        class="superSingularization-main-left"
        src="../assets/superSingularization/04.png"
        alt=""
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "app",
  props: {
    superSingularizationData: {
      title: "大行仓库(厂房或者货场面积大于9000m2)",
      titleImg: "",
      desc: "标准结构",
      descImg: "",
      features: "",
      FeaturesImg: ""
    }
  }
};
</script>
<style>
html,
body,
.app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.app {
  background-color: transparent;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.superSingularization {
  width: 500px;

  background-image: radial-gradient(#174abd, #042351);
  background-color: rgb(4, 35, 81);
  box-shadow: inset 1px 1px 45px #34eff9;
  border: 3px solid #34eff9;
}
.superSingularization-main {
  position: relative;
  width: 100%;
  background-image: url("../assets/superSingularization/0.png");
}
.superSingularization-main-top {
  position: absolute;
  top: -17px;
  left: -13px;
}
.superSingularization-main-right {
  position: absolute;
  top: -17px;
  right: -10px;
}
.superSingularization-main-bottom {
  position: absolute;
  left: -12px;
  bottom: -21px;
  opacity: 0.7;
}
.superSingularization-main-left {
  position: absolute;
  bottom: -17px;
  right: -10px;
}
.superSingularization-main-desc {
  padding: 35px;
}
.superSingularization-main-desc-item {
  color: #ffffff;
  margin-bottom: 45px;
}
.superSingularization-main-desc-item-img {
  margin-bottom: 32px;
}
.superSingularization-main-desc-item-title {
  font-size: 18px;
  box-sizing: border-box;
  background-color: rgba(52, 239, 249, 0.5);
  padding: 8px 15px;
  border: 1px solid #eee;
}
</style>
