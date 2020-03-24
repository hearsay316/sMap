<template>
  <div class="superMeasure">
    <div class="superMeasure-no">
      <div class="superMeasure-title">工具</div>
      <div class="superMeasure-open">
        <i class="iconfont icon-htmal5icon44"></i>
      </div>
    </div>
    <div class="superMeasure-active">
      <div></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "superMeasure",
  props: {
    isSuperMeasure: Boolean
  }
};
</script>
<style lang="stylus" scoped>
.superMeasure-no
  display grid
  width: 74px
  grid-template-columns 2fr  1fr
  div
    line-height 30px
    color #ffffff
  .superMeasure-title
    background-color #031E3C
  .superMeasure-open
    background-color #0BB1DD
    .icon-htmal5icon44
      font-size 12px
  .superMeasure-end
    display: grid;
    background-color #0BB1DD
    .icon-guanbi
      font-size 8px
.superMeasure-active
    display grid
    box-sizing border-box
    grid-template-rows
      width:74px
      height 453px
      background-color #1bc5a3
</style>
